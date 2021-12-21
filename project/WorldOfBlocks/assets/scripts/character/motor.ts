
import { _decorator, Node, RigidBody2D, Vec2, Vec3, tween, math, v3, debug } from 'cc';
import { CharacterEvent } from '../eventEnum';
import { EventMgr } from '../eventMgr';
import { Helper } from '../tools/helper';
import { Attr } from './attr';
import { PhysicStatus } from './physicStatus';

export class Motor extends EventMgr {

    //组件
    private _rb : RigidBody2D;
    private _attr : Attr;
    private _node : Node;
    private _physicStauts : PhysicStatus;

    //临时变量
    private _newVelocity : Vec2 = new Vec2(0, 0);

    //控制变量

    private _targetVelocityX : number = 0;
    private _curDir : number = 0;
    private _canJumpHeld : boolean = false;
    private _dashForce : Vec2 = new Vec2(0, 0);
    private _isDashing : boolean = false;
    private _originDashCount : number = 2;
    private _remainDashCount : number = 0;

    private get _canDash(){
        return this._remainDashCount > 0;
    }

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

    update(){
        this._dashing();

		this._toTargetXValue();

		//第二个条件「!this._isDashing」是因为有时候起跳了但是检测还没离开地面，会在第一次冲刺的一瞬间刷新次数，导致可以多冲刺一次
        if (this._physicStauts.isOnGround && !this._isDashing)
            this._refreshDashCount();   
    }

    stop(){
        this._setVelocity(0, 0);
    }

    stopX(){
        this._targetVelocityX = 0;
    }

    stopY(){
        this._setVelocity(this._curVelocity.x, 0);
    }

    /**
     * @param dir [1 ~ -1]的值，既表示方向也表示力度。
     */
    move(dir : number){
        this._curDir = dir;
        this._targetVelocityX = dir * this._attr.moveSpeed;

        if(dir == 0){
            return;
        }
            
        let dirNormalized = this._dirNormalized(dir);
        this._rotate(dirNormalized);
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
        if (!this._canDash || this._isDashing) return;
        this._dashStart(dir);
        Helper.scheduleOnce(() => this._dashEnd(), this._attr.dashDuration);
    }

    private _dashStart(dir : Vec2){
        this._dashForce = dir.clone().normalize().multiplyScalar(this._attr.dashingForce);
        this._isDashing = true;
        this._rb.gravityScale = 0;
        this._setVelocity(0, 0);
        this._remainDashCount--;
    }

    private _dashing(){
        if(this._isDashing){          
            this._setVelocity(this._dashForce);
        }
    }

    private _dashEnd(){
        this._isDashing = false;
        this._rb.gravityScale = 1;
        this._setVelocity(this._dashForce.clone().normalize().multiplyScalar(this._attr.dashFinishForce));
    }

    private _refreshDashCount(){
        this._remainDashCount = this._originDashCount;
    }

    private _setVelocity(x : number, y : number) : void;
    private _setVelocity(force : Vec2) : void;
    private _setVelocity(arg1 : number | Vec2, arg2 ?: number){
        
        let forceX : number;
        let forceY : number;

        if(arg1 instanceof Vec2){
            let force = arg1 as Vec2;

            forceX = force.x;
            forceY = force.y;
        }else{
         
            forceX = arg1 as number;
            forceY = arg2 as number;       
        }

        this._newVelocity.set(forceX, forceY);
        this._curVelocity = this._newVelocity;
    }

    private _addVelocity(x : number, y : number) : void;
    private _addVelocity(force : Vec2) : void;
    private _addVelocity(arg1 : number | Vec2, arg2 ?: number){
        if(arg1 instanceof Vec2){
            let force = arg1 as Vec2;
            this._setVelocity(force.x + this._curVelocity.x, force.y + this._curVelocity.y);
        }else{
            let forceX = arg1 as number;
            let forceY = arg2 as number;
            this._setVelocity(forceX + this._curVelocity.x, forceY + this._curVelocity.y);
        }
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

    private _toTargetXValue(){
        if(this._isDashing)
            return;

        if(this._targetVelocityX == this._curVelocity.x)
            return

        let step = 1;
        let xValue = calcValue(this._targetVelocityX, this._curVelocity.x, step);
        this._setVelocity(xValue, this._curVelocity.y);

        function calcValue(target : number, cur : number, step : number){
            let dir = cur < target ? 1 : -1;
            let diff = Math.abs(cur - target);
            let stepValue = Math.min(step, diff);
            return cur + stepValue * dir;
        }
    }
}
