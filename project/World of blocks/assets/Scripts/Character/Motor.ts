import { debug, RigidBody2D, Vec2 } from "cc";
import { Attr } from "./Attr";

export class Motor{

    private _attr : Attr;
    private _rb : RigidBody2D
    private _moveSpeedScale : number = 1;
    private _newVelocity : Vec2 = new Vec2(0, 0);

    constructor(attr : Attr, rb : RigidBody2D){
        this._attr = attr;
        this._rb = rb;
    }

    get isDashing(){
        return true;
    }  
    get moveSpeedScale(){
        return this._moveSpeedScale;
    }
    set moveSpeedScale(value : number){
        this._moveSpeedScale = value;
    }      

    stop(){
        this._setForce(0, 0);
    }
    
    stopX(){
        this._setForce(0, this._rb.linearVelocity.y);
    }

    stopY(){
        this._setForce(this._rb.linearVelocity.x, 0);
    }

    move(dir : number){
        this._setForce(this._attr.moveSpeed * this._moveSpeedScale * dir, this._rb.linearVelocity.y);
    }       
    oneJump(){

    }       
    doubleJump(){

    }        
    dash(){

    }
    private _setForce(x : number, y : number){
        this._newVelocity.set(x, y);
        this._rb.linearVelocity = this._newVelocity;
    }

    private _addForce(x : number, y : number){
        this._newVelocity.set(x, y);
        this._rb.linearVelocity.add(this._newVelocity);
    }
}