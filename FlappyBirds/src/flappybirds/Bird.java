/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package flappybirds;

import java.awt.Rectangle;
import pkg2dgamesframework.Objects;

/**
 *
 * @author Istiak
 */
public class Bird extends Objects{
    
    private float vt = 0;
    
    private boolean isFlying = false;

    private Rectangle rect;
    
    private boolean isLive = true;
    
    public Bird(int x, int y, int w, int h){
        super(x, y, w, h);  
        rect = new Rectangle(x, y, w, h);
    }
    
    public void setLive(boolean b){
        isLive = b;
    }
    
    public boolean getLive(){
        return isLive;
    }
    public Rectangle getRect(){
        return rect;
    }
    
    public void setVt(float vt){
        this.vt = vt;
    }
    public void update(long deltaTime){
        
        vt+=FlappyBirds.g;
        
        this.setPosY(this.getPosY()+vt);
        this.rect.setLocation((int) this.getPosX(),(int) this.getPosY());
        
        if(vt < 0) isFlying = true;
        else isFlying = false;
        
    }
    
    public void fly(){
        vt = -3;
    }
    
    
    public boolean getIsFlying(){
        return isFlying;
    }
}
