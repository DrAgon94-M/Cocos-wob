
import { _decorator, Component, Node } from 'cc';
import { CameraMgr } from './cameraMgr';
import { GameMgr } from './gameMgr';
import { InputMgr } from './input/inputMgr';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Controller extends Component {

    onLoad(){
        
        this.init();
        this.lateInit();

        setInterval(this.fixedUpdate, 0.02 * 1000);

        //FIXME 等待删掉
        this.tempTest();
    }

    init(){
        InputMgr.init();

    }

    lateInit(){
        GameMgr.lateInit();
        InputMgr.lateInit();
        CameraMgr.lateInit();
    }

    update(dt : number){
        InputMgr.update();
        CameraMgr.update(dt);
    }

    lateUpdate(dt : number){
        
    }

    fixedUpdate(){
        InputMgr.fixedUpdate();
    }

    tempTest(){
        CameraMgr.setFollow(GameMgr.player.node); //FIXME 这句话应该放在关卡管理者里
    }
}