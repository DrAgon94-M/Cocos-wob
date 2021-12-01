import { Component, KeyCode, _decorator } from "cc";
import { Controller } from "../character/controller";
import { GameMgr } from "../gameMgr";
import { KBInput } from "./kbInput";

const { ccclass, property } = _decorator;

class InputManager {
    private _kbInput: KBInput | null = null;
    private _player: Controller | null = null;
    private _moveValue = 0;

    async init() {
        this._kbInput = new KBInput();
    }

    async lateInit() {
        this._player = GameMgr.player;
    }

    update() {
        if (this._kbInput?.GetKeyDown(KeyCode.KEY_A)) {
            this._moveValue = -1;
        } else if (this._kbInput?.GetKeyDown(KeyCode.KEY_D)) {
            this._moveValue = 1;
        } else {
            this._moveValue = 0;
        }
    }

    fixedUpdate() {
        this._player?.move(this._moveValue);

        if (this._moveValue == 0) {

        }
    }
}

let InputMgr = new InputManager();
export { InputMgr }
