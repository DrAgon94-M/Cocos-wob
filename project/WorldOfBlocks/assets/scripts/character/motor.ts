
import { _decorator, Node, RigidBody2D, Vec2, Vec3, tween } from 'cc';
import { Attr } from './attr';

export class Motor {

    private _rb : RigidBody2D;
    private _attr : Attr;
    private _node : Node;

    private _newVelocity : Vec2 = new Vec2(0, 0);

    constructor(rb : RigidBody2D, attr : Attr, node : Node){
        this._rb = rb;
        this._attr = attr;
        this._node = node;
    }

    private get _curVelocity(){
        return this._rb.linearVelocity;
    }
    private set _curVelocity(value : Vec2){
        this._rb.linearVelocity = value;
    }

    /**
     * @param dir [1 ~ -1]的值，既表示方向也表示力度。
     */
    move(dir : number){
        if(dir == 0){
            this.stopX();
            return;
        }

        let dirNormalized = this._dirNormalized(dir);
        this._rotate(dirNormalized);
        this._setVelocity(dirNormalized * this._attr.moveSpeed, this._curVelocity.y);
    }

    stopX(){
        this._setVelocity(0, this._curVelocity.y);
    }

    private _setVelocity(x : number, y : number){
        this._newVelocity.set(x, y);
        this._curVelocity = this._newVelocity;  
    }

    private _addVelocity(x : number, y : number){
        this._newVelocity.set(x, y);
        this._curVelocity.add(this._newVelocity);
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
