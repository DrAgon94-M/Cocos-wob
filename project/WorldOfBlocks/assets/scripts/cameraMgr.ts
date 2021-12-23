import { Camera, find, Node, Vec2, Vec3 } from "cc"

class CameraManager {

    _camera: Camera | null = null;
    _cameraNode: Node | null = null;
    _curFollow: Node | null = null;

    lateInit() {
        this._createCamera();
    }

    update(dt: number) {
        this._setCameraPos(dt);
        this._setCameraShake(dt);
    }

    setFollow(node: Node | null) {
        this._curFollow = node;
    }

    doShake(truama : number, duration : number){

    }

    private _createCamera() {
        //FIXME 后续改成从预制体里创建
        this._cameraNode = find("Canvas/Camera");

        if (!this._cameraNode) {
            console.error("摄像机节点不存在于场景中!");
            return;
        }

        this._camera = this._cameraNode.getComponent(Camera) as Camera;

        if (!this._camera) {
            console.error("摄像机节点上不存在摄像机!");
            return;
        }
    }

    private _setCameraPos(dt: number) {
        if (!this._curFollow)
            return;

        let followPos = setZ(this._curFollow.position.clone(), 10);
        let curPos = this._cameraNode!.position.clone();
        let result = new Vec3();

        Vec3.lerp(result, curPos, followPos, dt);

        this._cameraNode!.setPosition(result);

        function setZ(v3: Vec3, z: number) {
            return new Vec3(v3.x, v3.y, z);
        }
    }

    private _setCameraShake(dt : number){

    }

    private _setTraumaToZero(dt : number){
        
    }
}

let CameraMgr = new CameraManager();
export { CameraMgr }