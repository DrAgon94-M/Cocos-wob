
import { _decorator, Component, Node, RigidBody2D, Vec3, Vec2 } from 'cc';
import { CharacterEvent } from '../eventEnum';
import { Animation } from './animation';
import { Attr } from './attr';
import { Motor } from './motor';
import { PhysicStatus } from './physicStatus';
const { ccclass, property } = _decorator;

@ccclass('CharacterController')
export class Controller extends Component {

    //components
    private _attr: Attr | null = null;
    private _physicStatus: PhysicStatus | null = null;
    private _motor: Motor | null = null;
    private _animation: Animation | null = null;

    //temp variables
    private _staticTime: number = 0;

    get isStatic(){
        if (this._physicStatus?.isOnGround
            && !(this._motor?.isMotioning)) 
            return true;
        else
            return false;
    }

    get isStaticForAWhile() {
        return this._staticTime == this._attr!.toStaticTime;
    }

    onLoad() {
        this._attr = new Attr();
        this._physicStatus = new PhysicStatus(this.node);
        this._motor = createMotor(this.node, this._attr, this._physicStatus);
        this._animation = createAnimation(this.node);

        this._registerEvent();

        function createMotor(node: Node, attr: Attr, physicStatus: PhysicStatus) {
            let rb = node.getComponent(RigidBody2D) as RigidBody2D;

            if (!rb) {
                console.error("本 Controller 物体上没有挂载 Rigidbody2D 组件。")
                return null;
            }

            return new Motor(rb, attr, node, physicStatus);
        }

        function createAnimation(node: Node) {
            let model = node.getChildByPath("Model") as Node;

            if (!model) {
                console.error("Player 上没有挂载 Model 子物体！");
                return null;
            }

            return new Animation(model);
        }
    }

    update(dt: number) {
        this._physicStatus?.update();

        this._checkIsStaticForAWhile(dt);

        if(this.isStaticForAWhile)
            this._onStaticForAWhile();
        else if(this.isStatic)
            this._onStatic();
    }                

    stop() {
        this._motor?.stop();
    }

    stopX() {
        this._motor?.stopX();
    }

    stopY() {
        this._motor?.stopY();
    }

    move(dir: number) {
        this._motor?.move(dir);
        
        if(this._physicStatus?.isOnGround)
            this._animation?.playMove(Math.abs(dir));
        else
            this._animation?.playMoveOnAir(Math.abs(dir));
    }

    jump() {
        this._motor?.jump();
    }

    jumpHeld() {
        this._motor?.jumpHeld();
    }

    dash(dir : Vec2){
        this._motor?.dash(dir);
    }

    private _registerEvent() {
        this._motor?.addListener(CharacterEvent.onOneJumped, async () => {
            await this._animation?.playOneJumpStart();
            await this._animation?.playOneJumpLeaveGround();
        }, this);

        this._physicStatus?.addListener(CharacterEvent.fallToGround, async () => {
            await this._animation?.playFallToGround();
        }, this);
    }

    private _checkIsStaticForAWhile(delatTime: number) {
        if (!this.isStatic) {
            this._staticTime = 0;
        }
        else {
            this._staticTime += delatTime;
            this._staticTime = Math.min(this._attr!.toStaticTime, this._staticTime);
        }
    }

    private _onStaticForAWhile(){
        this._animation?.playIdle();
    }

    private _onStatic(){
        this._animation?.playStop();
    }
}