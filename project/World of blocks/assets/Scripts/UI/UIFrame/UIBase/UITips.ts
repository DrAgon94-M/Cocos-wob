
import { _decorator, Component, Node } from 'cc';
import UIBase from './UIBase';
import { UIType } from '../UIEnum';
const { ccclass } = _decorator;
 
@ccclass('UITips')
export default abstract class UITips extends UIBase {
    get type(){
        return UIType.Tips
    }
}