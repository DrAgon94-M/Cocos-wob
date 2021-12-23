import { Color, Component, find, Graphics, Node, TERRAIN_HEIGHT_BASE, ValueType, Vec2, Vec3, _decorator } from "cc";
import { GameMgr } from "./gameMgr";
const {ccclass, property} = _decorator 

@ccclass("Painter")
export class Painter{
    private _graphics : Graphics | null = null;
    private _autoClear : boolean = true;
    get autoClear(){
        return this._autoClear;
    }
    set autoClear(value : boolean){
        this._autoClear = value;
    }

    constructor(graphics : Graphics | null = null, needInit : boolean = false, autoClear : boolean = false){
        if (!graphics){
            graphics = this._createGraphics();
            needInit = true;
        }
            
        this._graphics = graphics;
        
        if(needInit)
            this._initGraphics(graphics as Graphics);
            
        this.autoClear = autoClear;
    }

    /**
     * 输入多个 Graphics 组件的相对坐标，链接这些坐标画一条线。 
     */
    drawLine(...points : Vec2[]){
        let graphics = this._graphics as Graphics;

        if (this.autoClear)
            graphics.clear();
        
        graphics.moveTo(points[0].x, points[0].y);

        points
            .slice(1)
            .forEach(p => graphics.lineTo(p.x, p.y))
            ;

        graphics.stroke();
    }

    clear(){
        this._graphics?.clear();
    }

    setStrokeColor(color : Color){
        this._graphics!.strokeColor = color;
    }

    setLineWidth(width : number){
        this._graphics!.lineWidth = width;
    }

    private _createGraphics(){
        let graphicsNode = new Node("Painter");
        GameMgr.canvas?.addChild(graphicsNode);
        graphicsNode.setWorldPosition(0, 0, 0);
        return graphicsNode.addComponent(Graphics);
    }

    private _initGraphics(graphics : Graphics){
        graphics.strokeColor = Color.RED;
        graphics.lineWidth = 10;
    }

}