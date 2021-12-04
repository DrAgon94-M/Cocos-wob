import { Node, PhysicsSystem2D, Vec2 } from "cc";

export class PhysicStatus{
    private _node : Node;

    private _dirDown : Vec2 = new Vec2(0, -1);
    private _onGroundCheckDis : number = 5;
    private _isOnGround : Boolean = false;
    get isOnGround(){
        return true
    }

    constructor(node : Node){
        this._node = node;
    }

    update(){
        this._checkIsOnGround();
    }

    private _checkIsOnGround(){
        let start = new Vec2(this._node.worldPosition.x, this._node.worldPosition.y);
        
        if (this._raycast(start, this._dirDown, this._onGroundCheckDis))
            this._isOnGround = true;
        else
            this._isOnGround =false;
    }

    private _raycast(start : Vec2, dir : Vec2, distance : number){
        return PhysicsSystem2D.instance.raycast(start, dir.normalize().multiplyScalar(distance))
    }
}