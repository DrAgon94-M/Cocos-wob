import { find, Node } from "cc";
import { Controller } from "./character/controller";

class GameManager {

    private _player : Controller | null = null;
    private _canvas : Node | null = null;
    get player() {
        return this._player as Controller;
    }

    get canvas(){
        return this._canvas;
    }

    lateInit() {
        this._canvas = find("Canvas");
        if(!this._canvas){
            console.error("找不到 Canvas 组件");
            return;
        }

        this._createPlayer();
    }

    private _createPlayer() {
        //TODO 换成加载资源
        let playerNode = this.canvas?.getChildByPath("Player");
        if (!playerNode) {
            console.log("场景中不存在Player!");
            return;
        }

        let controller = playerNode?.getComponent(Controller) as Controller;
        if (!controller) {
            console.error("Player预制体上没有挂载 Controller 脚本!");
            return;
        }

        this._player = controller;
    }
}

let GameMgr = new GameManager();
export { GameMgr };