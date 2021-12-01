
import { _decorator, Component, Node } from 'cc';
import UIBase from './UIBase';
import { UIType } from '../UIEnum';
const { ccclass } = _decorator;

 
@ccclass('UIFixed')
export default abstract class UIFixed extends UIBase {

    get type(){
        return UIType.Fixed
    }

    async showAnim() { }
    async hideAnim() { }
}
