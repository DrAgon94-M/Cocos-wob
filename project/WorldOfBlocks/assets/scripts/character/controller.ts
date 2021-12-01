
import { _decorator, Component, Node, RigidBody2D, Vec3 } from 'cc';
import { Attr } from './attr';
import { Motor } from './motor';
const { ccclass, property } = _decorator;

@ccclass('CharacterController')
export class Controller extends Component {
    private _attr: Attr | null = null;
    private _motor: Motor | null = null;
    onLoad() {
        this._attr = new Attr();
        this._motor = createMotor(this.node, this._attr);

        function createMotor(node: Node, attr: Attr) {
            let rb = node.getComponent(RigidBody2D) as RigidBody2D;

            if (!rb) {
                console.error("本 Controller 物体上没有挂载 Rigidbody2D 组件。")
                return null;
            }

            return new Motor(rb, attr, node);
        }
    }

    update() {
        console.log("before", this.node.eulerAngles);
        this.node.eulerAngles = new Vec3(0, 180, 0);
        console.log("after", this.node.eulerAngles);
    }

    move(dir: number) {
        this._motor?.move(dir);
    }
}