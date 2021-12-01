import { Component, _decorator, Node, math, RigidBody2D, RigidBody, Vec3 } from "cc";
import { Animation } from "./Animation"
import { Attr } from "./Attr"
import { Motor } from "./Motor";
const { ccclass, property } = _decorator;

@ccclass("CharacterController")
export class Controller extends Component {
    //private _animation : Animation | null = null;
    private _attr : Attr | null = null;
    private _motor : Motor | null = null;

    //get animation(){
        //return this._animation;
    //}

    onLoad(){
        //this._createComponents();
    }

    update(){
        console.log("rotation", this.node.eulerAngles);
        //console.log("position", this.node.position);

        //this.node.eulerAngles = new Vec3(0, 180, 0);
    }

    private _createComponents(){
        this._attr = new Attr();
        //this._animation = new Animation(this.node);
        // this._motor = createMotor(this._attr, this.node);

        // function createMotor(attr : Attr, node : Node) {
        //     let rb = node.getComponent(RigidBody2D) as RigidBody2D;
        //     if (rb == null || rb == undefined){
        //         console.error("rb为null或undefined，请检查人物身上是否挂有rigidBody2D组件！");
        //     }
        //     return new Motor(attr, rb);
        // }
    }

    stop(){ 
        this._motor?.stop();
        //this._animation?.playIdle();
    }

    stopX(){
        this._motor?.stopX();
    }

    stopY(){
        this._motor?.stopY();
    }

    /**
     * 移动
     * @param dir [-1, 1]的一个数字
     */
    move(dir : number){

        // if (dir != 0){
        //     dir = this._normalized(dir);
        //     //this._animation?.playMove(Math.abs(dir));
        //     this._rotate(dir);
        //     this.stopX();
        // }

        //this._motor?.move(dir);
    } 
    jump(){

    }  
    dash(){

    }

    private _normalized(dir : number){
        return dir / Math.abs(dir) * Math.max(1, Math.abs(dir))
    }

    private _rotate(dir : number){
        let euler = this.node.eulerAngles;
        this.node.eulerAngles.set(euler.x, dir == -1 ? 180 : 0, euler.z);
    }
}