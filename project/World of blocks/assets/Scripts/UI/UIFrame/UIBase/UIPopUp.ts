
import { _decorator, Component, Node, Widget } from 'cc';
import UIBase from './UIBase';
import { UIType } from '../UIEnum';
const { ccclass } = _decorator;

@ccclass('UIPopUp')
export default abstract class UIPopUp extends UIBase {
    get type(){
        return UIType.PopUp
    }

    async show(){
        super.show();
    }
    
    async hide(){
        super.hide();
    }
}
