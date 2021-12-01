
import { _decorator, Component, Node } from 'cc';
import GameMgr from '../../Scripts/GameMgr';
import InputMgr from '../../Scripts/Input/InputMgr';
import SceneMgr from '../../Scripts/SceneMgr';
const { ccclass, property } = _decorator;

@ccclass('MainForController')
export class MainForController extends Component {

    async onLoad(){
        setTimeout(async () => {
            await this._init();
            await this._lateInit();
    
            setInterval(this.fixedUpdate, 0.02 * 1000);
        }, 2 * 1000);
    }

    private async _init(){
        await SceneMgr.init();
        //await InputMgr.init();
    }

    private async _lateInit(){
         await GameMgr.lateInit();
         //await InputMgr.lateInit();
    }

    update(){
        //InputMgr.update();
    }

    fixedUpdate(){
        //InputMgr.fixedUpdate();
    }
}