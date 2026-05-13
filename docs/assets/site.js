const REPO_OWNER = 'Istiaq-Alam';
const REPO_NAME = 'Flappy-Birds-Game';

function formatDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function el(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const node = el(id);
  if (!node) return;
  node.textContent = value;
}

function show(id) {
  const node = el(id);
  if (!node) return;
  node.classList.remove('hidden');
}

function hide(id) {
  const node = el(id);
  if (!node) return;
  node.classList.add('hidden');
}

function renderAssets(assets) {
  const root = el('release-assets');
  if (!root) return;

  root.innerHTML = '';

  if (!assets || assets.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'muted';
    empty.textContent = 'No downloadable assets found for this release.';
    root.appendChild(empty);
    return;
  }

  const list = document.createElement('div');
  list.className = 'assets__list';

  for (const asset of assets) {
    const row = document.createElement('div');
    row.className = 'asset';

    const left = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'asset__name';
    name.textContent = asset.name || 'download';

    const meta = document.createElement('div');
    meta.className = 'asset__meta';
    const sizeText = asset.size ? formatBytes(asset.size) : '';
    meta.textContent = [sizeText, asset.download_count != null ? `${asset.download_count} downloads` : '']
      .filter(Boolean)
      .join(' • ');

    left.appendChild(name);
    left.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'asset__actions';

    const link = document.createElement('a');
    link.className = 'button button--primary';
    link.href = asset.browser_download_url;
    link.textContent = 'Download';

    actions.appendChild(link);

    row.appendChild(left);
    row.appendChild(actions);
    list.appendChild(row);
  }

  root.appendChild(list);
}

async function loadLatestRelease() {
  hide('release-error');
  setText('release-tag', 'Loading…');
  setText('release-date', '—');

  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`;

  try {
    const response = await fetch(apiUrl, {
      headers: { Accept: 'application/vnd.github+json' },
    });

    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const data = await response.json();

    setText('release-tag', data.tag_name || data.name || 'Latest');
    setText('release-date', data.published_at ? formatDate(data.published_at) : '—');

    renderAssets(data.assets || []);
  } catch (error) {
    show('release-error');
    setText('release-tag', '—');
    setText('release-date', '—');
    renderAssets([]);
  }
}

loadLatestRelease();

