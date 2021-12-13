
import { _decorator, Node, RigidBody2D, Vec2, Vec3, tween, math } from 'cc';
import { CharacterEvent } from '../eventEnum';
import { EventMgr } from '../eventMgr';
import { Attr } from './attr';
import { PhysicStatus } from './physicStatus';

export class Motor extends EventMgr {

    private _rb : RigidBody2D;
    private _attr : Attr;
    private _node : Node;
    private _physicStauts : PhysicStatus;

    private _newVelocity : Vec2 = new Vec2(0, 0);

    private _curDir : number = 0;
    private _canJumpHeld : boolean = false;

    constructor(rb : RigidBody2D, attr : Attr, node : Node, physicStatus : PhysicStatus){
        super();

        this._rb = rb;
        this._attr = attr;
        this._node = node;
        this._physicStauts = physicStatus;
    }

    get isMotioning(){
        return this._curDir != 0 
            || this._canJumpHeld != false
            ;
    }

    private get _curVelocity(){
        return this._rb.linearVelocity;
    }
    private set _curVelocity(value : Vec2){
        this._rb.linearVelocity = value;
    }

    stop(){
        this._setVelocity(0, 0);
    }

    stopX(){
        this._setVelocity(0, this._curVelocity.y);
    }

    stopY(){
        this._setVelocity(this._curVelocity.x, 0);
    }

    /**
     * @param dir [1 ~ -1]的值，既表示方向也表示力度。
     */
    move(dir : number){
        this._curDir = dir;

        if(dir == 0){
            return;
        }

        let dirNormalized = this._dirNormalized(dir);
        this._rotate(dirNormalized);
        this._setVelocity(dirNormalized * this._attr.moveSpeed, this._curVelocity.y);
    }

    jump(){
        if(this._physicStauts.isOnGround){
            this._addVelocity(0, this._attr.oneJumpForce);
            this.emit(CharacterEvent.onOneJumped);
            
            this._canJumpHeld = true;
            setTimeout(() => {
                this._canJumpHeld = false;
            }, this._attr.oneJumpHeldDuration * 1000);
        }        
    }

    jumpHeld(){
        if(this._canJumpHeld){
            this._addVelocity(0, this._attr.oneJumpHeldForce)
        }
    }

    dash(dir : Vec2){
        let force = dir.normalize().multiplyScalar(this._attr.dashForce);
        this._setVelocity(force.x, force.y);
    }

    private _setVelocity(x : number, y : number){
        this._newVelocity.set(x, y);
        this._curVelocity = this._newVelocity;  
    }

    private _addVelocity(x : number, y : number){
        this._newVelocity.set(x + this._curVelocity.x, y + this._curVelocity.y);
        this._curVelocity = this._newVelocity;
        //this._curVelocity.add(this._newVelocity);
    }

    private _dirNormalized(dir : number){
        return dir / Math.abs(dir) * Math.min(1, Math.abs(dir))
    }

    private _rotate(dir : number){
        let originScale = this._node.scale;

        if(dir == originScale.x){
            return;
        }

        this._node.scale.set(dir, originScale.y, originScale.z);
    }
}
