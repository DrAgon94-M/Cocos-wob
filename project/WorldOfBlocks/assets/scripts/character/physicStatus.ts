import { Color, Graphics, Node, PhysicsSystem2D, RaycastResult2D, RigidBody2D, Vec2 } from "cc";
import { CharacterEvent } from "../eventEnum";
import { EventMgr } from "../eventMgr";
import { Painter } from "../painter";
import { WOBSystem } from "../wobSystem";

export class PhysicStatus extends EventMgr {
    private _node : Node;
    private _rb : RigidBody2D;
    private _painter : Painter | null = null;

    private _dirDown : Vec2 = new Vec2(0, -1);
    private _onGroundCheckDis : number = 10;

    private _isOnGround : boolean = false;

    get isOnGround(){
        return this._isOnGround;
    }

    get isFall(){
        return this._rb.linearVelocity.y < 0;
    }

    private set isOnGround(value : boolean){
        if(this.isOnGround == value)
            return;

        if (!this.isOnGround){
            this.emit(CharacterEvent.fallToGround);
        }else if(this.isOnGround){
            this.emit(CharacterEvent.leaveFromGround);
        }

        this._isOnGround = value;
    }

    constructor(node : Node, rb : RigidBody2D){
        super();
    
        this._node = node;
        this._rb = rb;

        if(WOBSystem.isEngine)
            this._painter = new Painter();       
    }

    update(){
        this._painter?.clear();

        this._checkIsOnGround();
    }

    private _checkIsOnGround(){
        let start = new Vec2(this._node.worldPosition.x, this._node.worldPosition.y);
        
        if (this._raycast(start, this._dirDown, this._onGroundCheckDis))
            this.isOnGround = true;
        else
            this.isOnGround = false;
    }

    private _raycast(start : Vec2, dir : Vec2, distance : number){
        let originStart = start.clone();
        let end = start.add(dir.normalize().multiplyScalar(distance));

        let result = PhysicsSystem2D.instance.raycast(originStart, end);
        
        this._showDebugGraphics(result as Array<RaycastResult2D>, originStart, end);

        if(result.length == 0)
            return null;
        else
            return result;
    }

    private _showDebugGraphics(result : Array<RaycastResult2D>, start : Vec2, end : Vec2){
        if(result.length > 0)
            this._painter?.setStrokeColor(Color.RED);
        else
            this._painter?.setStrokeColor(Color.GREEN);

        this._painter?.drawLine(start, end);
    }
}