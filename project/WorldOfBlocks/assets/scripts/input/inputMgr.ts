import { Component, EventKeyboard, KeyCode, SystemEvent, systemEvent, Vec2, _decorator } from "cc";
import { Controller } from "../character/controller";
import { DashDir } from "../character/enum";
import { GameMgr } from "../gameMgr";
import { KBInput } from "./kbInput";

const { ccclass, property } = _decorator;

class InputManager {
    private _kbInput: KBInput | null = null;
    private _player: Controller | null = null;
    private _moveValue = 0;
    private _jmuped = false;
    private _jumpHeld = false;
    private _dashed = false;
    async init() {
        this._kbInput = new KBInput();

        systemEvent.on(SystemEvent.EventType.KEY_DOWN, (e: EventKeyboard) => {
            this._recordDashDir(e.keyCode);
        }, this);

        systemEvent.on(SystemEvent.EventType.KEY_UP, (e: EventKeyboard) => {
            this._deleteDashDirRecord(e.keyCode);
        }, this);
    }

    async lateInit() {
        this._player = GameMgr.player;
    }

    update() {
        if (this._kbInput?.GetKeyDown(KeyCode.KEY_A))
            this._moveValue = -1;
        else if (this._kbInput?.GetKeyDown(KeyCode.KEY_D))
            this._moveValue = 1;
        else
            this._moveValue = 0;


        if (this._kbInput?.GetKey(KeyCode.SPACE))
            this._jmuped = true;

        this._jumpHeld = this._kbInput?.GetKeyDown(KeyCode.SPACE) as boolean;

        if (this._kbInput?.GetKey(KeyCode.SHIFT_LEFT))
            this._dashed = true;
    }

    fixedUpdate() {
        this._player?.move(this._moveValue);

        if (this._moveValue == 0) {
            this._player?.stopX();
        }

        if (this._jmuped) {
            this._jmuped = false;
            this._player?.jump();
        }

        if (this._jumpHeld) {
            this._player?.jumpHeld();
        }

        if (this._dashed) {
            this._dashed = false;
            this._player?.dash(this._curDashDir());
        }
    }

    private _curDashDir() {

        return new Vec2(0, 0);
    }

    private _dashDirKey = new Array<number>();

    private _recordDashDir(keyCode: number) {

        if(!this._isDashDirKey(keyCode))
            return;

        //检测按键
        if (this._dashDirKey.length == 2) {
            this._dashDirKey.shift();
        }

        this._dashDirKey.push(keyCode);
    }

    private _deleteDashDirRecord(keyCode: number) {
        if(!this._isDashDirKey(keyCode))
            return;

        this._dashDirKey = this._dashDirKey.filter((value) => {
            return value != keyCode;
        })
    }

    private _isDashDirKey(keyCode : number){
        return (
        keyCode == KeyCode.KEY_A ||
        keyCode == KeyCode.KEY_D ||
        keyCode == KeyCode.KEY_W ||
        keyCode == KeyCode.KEY_S
        );
    }
}

let InputMgr = new InputManager();
export { InputMgr }
