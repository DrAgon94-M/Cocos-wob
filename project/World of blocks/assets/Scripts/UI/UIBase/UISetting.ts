
import { _decorator, Node, tween, Vec3, Button, Sprite } from 'cc';
import SceneMgr from '../../SceneMgr';
import UIPopUp from '../UIFrame/UIBase/UIPopUp';
const { ccclass, property } = _decorator;


@ccclass('UISetting')
export class UISetting extends UIPopUp {
    private _Node_Panel: Node | null = null;
    private _Sprite_Shadow: Sprite | null = null;

    private _showPos: Vec3 = Vec3.ZERO;
    private _hidePos: Vec3 = Vec3.ZERO;

    onLoad() {
        this._Node_Panel = this.node.getChildByPath("Node_Panel");
        this._Sprite_Shadow = this.node.getChildByPath("Sprite_Shadow")?.getComponent(Sprite) as Sprite;

        this._showPos = Vec3.ZERO;
        this._hidePos = new Vec3(-SceneMgr.CurSize!.x, 0, 0);

        this._Node_Panel?.setPosition(this._hidePos);
        this._Sprite_Shadow.color._set_a_unsafe(0);

        this._set_ButtonClose_ClickEvent();
    }

    showAnim(): Promise<void> {
        return new Promise((resolve, reject) => {
            tween(this._Node_Panel)
                .to(0.5, { position: this._showPos }, { easing: "expoOut" })
                .start();

            tween(this._Sprite_Shadow?.color)
                .to(0.5, { a: 255 }, { easing: "expoOut" })
                .start();

            this.scheduleOnce(() => {
                resolve();
            }, 0.5);
        })
    }

    hideAnim(): Promise<void> {
        return new Promise((resolve, reject) => {
            tween(this._Node_Panel)
                .to(0.5, { position: this._hidePos }, { easing: "expoOut" })
                .start()

            tween(this._Sprite_Shadow?.color)
                .to(0.5, { a: 0 }, { easing: "expoOut" })
                .start();

            this.scheduleOnce(() => {
                resolve();
            }, 0.2); //优化手感
        })
    }

    private _set_ButtonClose_ClickEvent() {
        let button_Close = this.node.getChildByPath("Node_Panel/Button_Close")?.getComponent(Button);
        button_Close!.node.on(Button.EventType.CLICK, () => this.uiMgr.closeForm(this.uiName), this);
    }
}