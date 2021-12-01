
import { _decorator, Node, EventTouch, Vec2, Vec3, UITransform } from 'cc';
import UIScreen from '../UIFrame/UIBase/UIScreen';
const { ccclass } = _decorator;

@ccclass('UIOperation')
export abstract class UIOperation extends UIScreen {

    onLoad(){
        this._setMoveEvent();
    }

    private _setMoveEvent(){
        let curSize = this.node.getComponent(UITransform)?.contentSize;
        let sprite_Move = this.node.getChildByPath("Sprite_Move");
        let sprite_Joystick_BG = this.node.getChildByPath("Sprite_Joystick_BG");
        let sprite_Joystick = this.node.getChildByPath("Sprite_Joystick_BG/Sprite_Joystick");

        sprite_Joystick_BG!.active = false;

        sprite_Move?.on(Node.EventType.TOUCH_START, (e : EventTouch) =>{
            let pos = e.getLocation();

            sprite_Joystick_BG!.active = true;
            sprite_Joystick_BG?.setPosition(pos.x - curSize!.x / 2, pos.y - curSize!.y / 2, 0);
            sprite_Joystick?.setPosition(Vec3.ZERO);
        }, this);

        sprite_Move?.on(Node.EventType.TOUCH_MOVE, (e : EventTouch) =>{
            let delta = e.getDelta();
            this._addJoystickPos(sprite_Joystick as Node, 128, delta);
        }, this);

        sprite_Move?.on(Node.EventType.TOUCH_END, () =>{
            sprite_Joystick_BG!.active = false;
        }, this);

        sprite_Move?.on(Node.EventType.TOUCH_CANCEL, () =>{
            sprite_Joystick_BG!.active = false;
        }, this);

    }

    private _addJoystickPos(joystick : Node, maxDis : number, delta : Vec2){
        let targetPos = joystick.getPosition().add3f(delta.x, delta.y, 0);

        if (Vec3.distance(targetPos, Vec3.ZERO) > maxDis){
            joystick.setPosition(targetPos.normalize().multiplyScalar(maxDis));
        }
        else{
            joystick.setPosition(targetPos);
        }
    }
}
