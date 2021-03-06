import { BoxCollider, BoxCollider2D, Color, Graphics, Node, PhysicsSystem2D, RaycastResult2D, RigidBody2D, SpotLightComponent, Vec2 } from "cc";
import { CharacterEvent } from "../eventEnum";
import { EventMgr } from "../eventMgr";
import { Painter } from "../painter";
import { WOBSystem } from "../wobSystem";

export class PhysicStatus extends EventMgr {
    private _node : Node;
    private _rb : RigidBody2D;
    private _collider : BoxCollider2D;
    private _painter : Painter | null = null;

    private _dirDown : Vec2 = new Vec2(0, -1);
    private _checkDis : number = 10;
    private _checkHitWallOffsetY : number = 10;
    private _isOnGround : boolean = false;
    private _isHitWall : boolean = false;
    private _leaveGroundTime : number = 0;
    get isOnGround(){
        return this._isOnGround;
    }

    get isHitWall(){
        return this._isHitWall;
    }

    get isFall(){
        return this._rb.linearVelocity.y < 0;
    }

    get leaveGroundTime(){
        return this._leaveGroundTime;
    }

    private get _curDir(){
        return this._node.scale.x;
    }

    private get _curPos(){
        return this._node.worldPosition;
    }

    private get _curSize(){
        return this._collider.size;
    }

    private set isOnGround(value : boolean){
        if(this.isOnGround == value)
            return;

        if (!this.isOnGround){
            this._leaveGroundTime = 0;
            this.emit(CharacterEvent.fallToGround);
        }else if(this.isOnGround){
            this.emit(CharacterEvent.leaveFromGround);
        }

        this._isOnGround = value;
    }


    constructor(node : Node, rb : RigidBody2D, collider : BoxCollider2D){
        super();
    
        this._node = node;
        this._rb = rb;
        this._collider = collider;

        if(WOBSystem.isEngine)
            this._painter = new Painter();       
    }

    update(dt : number){
        this._painter?.clear();

        this._checkIsOnGround();
        this._checkIsHitWall();
        this._recordLeaveGroundTime(dt);
    }

    private _checkIsOnGround(){
        let totalWidth = this._curSize.width;
        let cumulativeWidth = -WOBSystem.minUnit; //???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 0
        let leftMostX = this._curPos.x - totalWidth / 2;
        let result = false;

        while (cumulativeWidth < totalWidth){
            cumulativeWidth = Math.min(cumulativeWidth + WOBSystem.minUnit, totalWidth);

            let start = new Vec2(leftMostX + cumulativeWidth, this._curPos.y);

            if (this._raycast(start, this._dirDown, this._checkDis))
            {
                result = true;
                break; //??????????????????????????????????????????????????????????????????
            }
            else
                result = false;  
        }

        this.isOnGround = result;
    }

    private _checkIsHitWall(){
        let start_x = this._curPos.x + this._curSize.width / 2 * this._curDir

        let start_buttom = new Vec2(start_x, this._curPos.y + this._checkHitWallOffsetY);
        let start_top = new Vec2(start_x, this._curPos.y + this._curSize.height - this._checkHitWallOffsetY);
                                
        let dir = new Vec2(this._curDir, 0);

        this._isHitWall = false;

        if (this._raycast(start_buttom, dir, this._checkDis))
            this._isHitWall = true;

        if (this._raycast(start_top, dir, this._checkDis))
            this._isHitWall = true;
    }

    private _raycast(start : Vec2, dir : Vec2, distance : number){
        let originStart = start.clone();
        let end = start.add(dir.normalize().multiplyScalar(distance));

        let result = PhysicsSystem2D.instance.raycast(originStart, end);
        
        this._showRay(result as Array<RaycastResult2D>, originStart, end);

        if(result.length == 0)
            return null;
        else
            return result;
    }

    private _showRay(result : Array<RaycastResult2D>, start : Vec2, end : Vec2){
        if(result.length > 0)
            this._painter?.setStrokeColor(Color.RED);
        else
            this._painter?.setStrokeColor(Color.GREEN);

        this._painter?.drawLine(start, end);
    }

    private _recordLeaveGroundTime(dt : number) {
        if(!this.isOnGround)
            this._leaveGroundTime += dt;
    }
}