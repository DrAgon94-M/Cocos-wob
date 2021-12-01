
import { _decorator, Component, Node } from 'cc';
import GameMgr from './GameMgr';
import InputMgr from './Input/InputMgr';
import SceneMgr from './SceneMgr';
import UIMgr from './UI/UIFrame/UIMgr';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
 
    async onLoad(){
        await this._init();
        await this._lateInit();

        await UIMgr.openForm("UILoading");
        await UIMgr.openForm("UIMainMenu");
        await UIMgr.openForm("UIToolbar");
        await UIMgr.closeForm("UILoading");

        setInterval(this.fixedUpdate, 0.02 * 1000);
    }

    private async _init(){
        await SceneMgr.init();
        await InputMgr.init();
    }

    private async _lateInit(){
         await UIMgr.lateInit();
         await GameMgr.lateInit();
         await InputMgr.lateInit();
    }

    update(){
        InputMgr.update();
    }

    fixedUpdate(){
        InputMgr.fixedUpdate();
    }
}
