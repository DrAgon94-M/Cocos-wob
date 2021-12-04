
import { _decorator, Component, Node, RigidBody2D, Vec3 } from 'cc';
import { Animation } from './animation';
import { Attr } from './attr';
import { Motor } from './motor';
import { PhysicStatus } from './physicStatus';
const { ccclass, property } = _decorator;

@ccclass('CharacterController')
export class Controller extends Component {
    private _attr: Attr | null = null;
    private _physicStatus : PhysicStatus | null = null;
    private _motor: Motor | null = null;
    private _animation : Animation | null = null;
    onLoad() {
        this._attr = new Attr();
        this._physicStatus = new PhysicStatus(this.node);
        this._motor = createMotor(this.node, this._attr, this._physicStatus);
        this._animation = createAnimation(this.node)

        function createMotor(node: Node, attr: Attr, physicStatus : PhysicStatus) {
            let rb = node.getComponent(RigidBody2D) as RigidBody2D;

            if (!rb) {
                console.error("本 Controller 物体上没有挂载 Rigidbody2D 组件。")
                return null;
            }

            return new Motor(rb, attr, node, physicStatus);
        }

        function createAnimation(node : Node){
            let model = node.getChildByPath("Model") as Node;

            if(!model){
                console.error("Player 上没有挂载 Model 子物体！");
                return null;
            }

            return new Animation(model);
        }
    }

    update(dt : number){
        this._physicStatus?.update();
    }

    stop(){
        this._motor?.stop();
    }

    stopX(){
        this._motor?.stopX();
        this._animation?.playIdle();
    }

    move(dir: number) {
        if (dir == 0){
            this._motor?.stopX();
            return;
        }

        this._motor?.move(dir);
        this._animation?.playMove(Math.abs(dir));
    }
}