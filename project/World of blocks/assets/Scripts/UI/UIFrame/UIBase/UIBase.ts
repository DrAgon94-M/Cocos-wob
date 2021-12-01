
import { _decorator, Component, Node } from 'cc';
import { UIType } from '../UIEnum';
import UIMgr from '../UIMgr';
const { ccclass } = _decorator;

@ccclass('UIBase')
export default abstract class UIBase extends Component {

    abstract get type() : UIType;

    get isShowing(){
        return this.node.active;
    }

    get uiName(){
        return this.node.name;
    }

    get uiMgr(){
        return UIMgr
    }

    async show(){
        this.node.active = true;
    }
    
    async hide(){
        this.node.active = false;
    }

    beforeShow() {}
    afterShow() {}

    beforeHide() {}
    afterHide() {}

    abstract showAnim() : Promise<void>;
    abstract hideAnim() : Promise<void>;
}
