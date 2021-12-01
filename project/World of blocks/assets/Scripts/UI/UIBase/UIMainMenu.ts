
import { _decorator, Node, Label, tween } from 'cc';
import UIScreen from '../UIFrame/UIBase/UIScreen';
const { ccclass, property } = _decorator;

@ccclass('UIMainMenu')
export class UIMainMenu extends UIScreen {

    onLoad() {
        this._setToContinueAnim();
        this._setToContinueEvent();
    }

    private _setToContinueAnim() {
        let label_toCotinue = this.node.getChildByPath("Label_toCotinue")?.getComponent(Label) as Label;

        tween(label_toCotinue.color)
            .to(2, { a: 255 }, { easing: "quartOut" })
            .to(2, { a: 0   }, { easing: "quartIn" })
            .union()
            .repeatForever()
            .start();
    }

    private _setToContinueEvent() {
        let node_Operation = this.node.getChildByPath("Node_Operation");

        node_Operation?.on(Node.EventType.TOUCH_END, () => {
            this.uiMgr.closeForm(this.uiName)
            this.uiMgr.openForm("UIOperation");
        }, this);
    }
}
