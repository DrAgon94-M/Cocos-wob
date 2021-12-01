
import { _decorator, Component, Node } from 'cc';
import UIBase from './UIBase';
import { UIType } from '../UIEnum';
const { ccclass } = _decorator;

@ccclass('UIScreen')
export default abstract class UIScreen extends UIBase {

    get type() {
        return UIType.Screen
    }

    async show() {

    }

    async showAnim() { }
    async hideAnim() { }
}
