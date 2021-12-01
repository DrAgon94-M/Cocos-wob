
import { _decorator, Component, Node } from 'cc';
import { GameMgr } from './gameMgr';
import { InputMgr } from './input/inputMgr';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Controller extends Component {

    onLoad(){
        
        this.init();
        this.lateInit();

        setInterval(this.fixedUpdate, 0.02 * 1000);
    }

    init(){
        InputMgr.init();
    }
    lateInit(){
        GameMgr.lateInit();
        InputMgr.lateInit();
    }

    update(){
        InputMgr.update();
    }

    fixedUpdate(){
        InputMgr.fixedUpdate();
    }
}