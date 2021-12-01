import { _decorator, Component, Node, find, error, Size, UITransform } from 'cc';

class SceneMgr {
    Canvas : Node | null = null;
    levelRoot : Node | null = null;
    characterRoot : Node | null = null;
    uiRoot : Node | null = null;
    curSize : Size | null | undefined = null;

    get CurSize(){
        return this.curSize;
    }

    async init(){
        this.Canvas = find("Canvas");
        if (!this.Canvas) {
            error("Canvas 不存在！");
            return;
        }
            
        this.Canvas!.addChild(this.levelRoot = new Node("LevelRoot"));
        this.Canvas!.addChild(this.characterRoot = new Node("CharacterRoot"));
        this.Canvas!.addChild(this.uiRoot = new Node("UIRoot"));

        this.curSize = this.Canvas.getComponent(UITransform)?.contentSize; 
    }
} 

export default new SceneMgr();