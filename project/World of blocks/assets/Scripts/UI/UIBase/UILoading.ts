
import { _decorator, Node, tween, Vec2, Vec3 } from 'cc';
import SceneMgr from '../../SceneMgr';
import UIPopUp from '../UIFrame/UIBase/UIPopUp';
const { ccclass, property } = _decorator;
 
@ccclass('UILoading')
export class UILoading extends UIPopUp {

    private _Sprite_Background : Node | null = null;
    private _showPos: Vec3 = Vec3.ZERO;
    private _hidePos: Vec3 = Vec3.ZERO;

    onLoad(){
        this._Sprite_Background = this.node.getChildByPath("Sprite_Background");

        this._showPos = Vec3.ZERO;
        this._hidePos = new Vec3(0, SceneMgr.CurSize?.height, 0);
    }

    showAnim(): Promise<void> {
        return new Promise((reslove, reject) =>{
            tween(this._Sprite_Background)
                .to(0.5, {position : this._showPos}, {easing : "elasticOut"})
                .start();

            this.scheduleOnce(() =>{
                reslove();
            }, 0.5);
        })
    }

    hideAnim(): Promise<void> {
        return new Promise((reslove, reject) =>{
            tween(this._Sprite_Background)
                .to(0.5, {position : this._hidePos}, {easing : "elasticOut"})
                .start();

            this.scheduleOnce(() =>{
                reslove();
            }, 0.5);
        })
    }

}
