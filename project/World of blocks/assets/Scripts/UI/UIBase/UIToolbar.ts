
import { _decorator, Button } from 'cc';
import UIFixed from '../UIFrame/UIBase/UIFixed';
import UIMgr from '../UIFrame/UIMgr';
const { ccclass, property } = _decorator;

@ccclass('UIToolbar')
export class UIToolbar extends UIFixed {

    onLoad() {
        this._set_ButtonSetting_ClickEvent();
    }

    private _set_ButtonSetting_ClickEvent() {
        let button_Setting = this.node.getChildByPath("Button_Setting")?.getComponent(Button);
        button_Setting?.node.on(Button.EventType.CLICK, () => UIMgr.openForm("UISetting"), this);
    }
}
