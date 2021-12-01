
import { _decorator, Component, find, Button } from 'cc';
import { Animation } from '../../Scripts/Character/Animation';
import { Controller } from '../../Scripts/Character/Controller';
const { ccclass, property } = _decorator;
 
@ccclass('UIShowAnim')
export class UIShowAnim extends Component {

    private _animation : Animation | null = null;

    async onLoad(){
        this.btnStopClick();
        this.btnPlayIdleClick();
        this.btnPlayFastMoveClick();
        this.btnPlaySlowlyMoveClick();
        this.btnPlayOneJumpClick();
        this.btnPlayDoubleJumpClick();
    }

    start(){
        //this._animation = find("Canvas/Player")?.getComponent(Controller)?.animation as Animation;
    }

    btnStopClick(){
        let btn = this.node.getChildByPath("Grid_Btns/Btn_Stop")!.getComponent(Button);
        btn?.node.on(Button.EventType.CLICK, () => this._animation?.stop(), this);
    }

    btnPlayIdleClick(){
        let btn = this.node.getChildByPath("Grid_Btns/Btn_PlayIdle")!.getComponent(Button);
        btn?.node.on(Button.EventType.CLICK, () => this._animation?.playIdle(), this);
    }

    btnPlayFastMoveClick(){
        let btn = this.node.getChildByPath("Grid_Btns/Btn_PlayFastMove")!.getComponent(Button);
        btn?.node.on(Button.EventType.CLICK, () => this._animation?.playMove(1), this);
    }

    btnPlaySlowlyMoveClick(){
        let btn = this.node.getChildByPath("Grid_Btns/Btn_PlaySlowlyMove")!.getComponent(Button);
        btn?.node.on(Button.EventType.CLICK, () => this._animation?.playMove(0.5), this);
    }

    btnPlayOneJumpClick(){
        let btn = this.node.getChildByPath("Grid_Btns/Btn_PlayOneJump")!.getComponent(Button);
        btn?.node.on(Button.EventType.CLICK, async () => {
             await this._animation?.playOneJumpStart();
             await this._animation?.playOneJumpLeaveGround();
             this._animation?.stop();
        }, this);
    }

    btnPlayDoubleJumpClick(){
        let btn = this.node.getChildByPath("Grid_Btns/Btn_PlayDoubleJump")!.getComponent(Button);
        btn?.node.on(Button.EventType.CLICK, async () => {
             await this._animation?.playDoubleJumpStart();
             this._animation?.stop();
        }, this);
    }
}
