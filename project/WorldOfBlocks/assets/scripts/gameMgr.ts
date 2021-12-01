import { find } from "cc";
import { Controller } from "./character/controller";

class GameManager {

    private _player: Controller | null = null;
    get player() {
        return this._player as Controller;
    }

    lateInit() {
        this._createPlayer();
    }

    private _createPlayer() {
        //TODO 换成加载资源
        let node = find("Canvas/Player");

        if (!node) {
            console.log("场景中不存在Player!");
            return;
        }

        let controller = node?.getComponent(Controller) as Controller;

        if (!controller) {
            console.error("Player预制体上没有挂载 Controller 脚本！");
            return;
        }

        this._player = controller;
    }
}

let GameMgr = new GameManager();
export { GameMgr };