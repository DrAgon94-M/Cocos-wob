import { Component, KeyCode, Node, _decorator } from "cc";
import { Controller } from "./Character/Controller";
import LevelMgr from "./LevelMgr";
import ResMgr from "./ResMgr";
import SceneMgr from "./SceneMgr";

class GameMgr{
    _player : Controller | null = null;
    async lateInit(){
        await this._createPlayer();
        this.resetPlayerPos();
    }

    get player(){
        return this._player;
    }

    resetPlayerPos(){
        this._player!.node.position = LevelMgr.resetPos;
        console.log(4, this._player?.node.eulerAngles);
    }

    private async _createPlayer(){
        let node = await ResMgr.loadPrefab("Character/Player");
        console.log(1, node.eulerAngles);
        SceneMgr.characterRoot?.addChild(node); 
        console.log(2, node.eulerAngles);
        this._player = node.getComponent(Controller); 
        console.log(3, node.eulerAngles);  
    }

}

export default new GameMgr();