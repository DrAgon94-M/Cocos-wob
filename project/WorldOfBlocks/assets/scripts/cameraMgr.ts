import { Camera, Color, find, Node, random, randomRange, Vec2, Vec3 } from "cc"
import { Painter } from "./painter";
import { WOBSystem } from "./wobSystem";

class CameraManager {

    private _camera: Camera | null = null;
    private _cameraNode: Node | null = null;
    private _curFollow: Node | null = null;
    private _painter : Painter | null = null;

    //控制变量
    private _trauma : number = 0;
    private _shakeForce : number = 0;
    private _maxOffset : number = 40;
    private _maxEuler : number = 10;
    private _freezeTrauma : boolean = false;

    get trauma(){
        return this._trauma;
    }
    set trauma(value : number){
        this._trauma = value;

        if(this._trauma < 0)
            this._trauma = 0;
        else if(this._trauma > 1)
            this._trauma = 1;

        this._shakeForce = Math.pow(this.trauma, 2);
    }

    lateInit() {
        this._createCamera();

        if(WOBSystem.isEngine){
            this._painter = new Painter(); 
            this._painter.setLineWidth(100);
        }
    }

    update(dt: number) {
        this._painter?.clear();
        this._setCameraPos2(dt);
        this._setCameraShake(dt);
        this._drawTraumaAndShakeForce();
    }

    setFollow(node: Node | null) {
        this._curFollow = node;
    }

    doShake(trauma : number){
        this.trauma = trauma;
    }

    doShakeByAdd(trauma : number){
        this.trauma += trauma;
    }

    setFreezeTrauma(value? : boolean){
        this._freezeTrauma = value ? value : !this._freezeTrauma;
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

        let followPos = this._setZ(this._curFollow.position.clone(), 10);
        let curPos = this._cameraNode!.position.clone();
        let result = new Vec3();

        Vec3.lerp(result, curPos, followPos, dt);

        this._cameraNode!.setPosition(result);
    }

    private _setCameraPos2(dt : number){
        if (!this._curFollow)
            return;

        let followPos = this._setZ(this._curFollow.position.clone(), 10);
        this._cameraNode!.setPosition(followPos);
    }

    private _setZ(v3: Vec3, z: number) {
        return new Vec3(v3.x, v3.y, z);
    }

    private _setCameraShake(dt : number){
        if(this.trauma == 0)
            return;

        this._cameraNode!.eulerAngles = Vec3.ZERO;

        this._doPositionShake();
        this._doRotationShake();

        this._setTraumaToZero(dt);
    }

    private _doPositionShake(){
        let position = this._cameraNode!.position;

        let offsetX = this._maxOffset * randomRange(-1, 1) * this._shakeForce;
        let offsetY = this._maxOffset * randomRange(-1, 1) * this._shakeForce;

        let shakePosition = new Vec3(position.x + offsetX, position.y + offsetY, position.z);

        this._cameraNode!.position = shakePosition;
    }

    private _doRotationShake(){
        let euler = this._cameraNode!.eulerAngles;

        let zValue = this._maxEuler * randomRange(-1, 1) * this._shakeForce;

        let shakeEuler = new Vec3(euler.x, euler.y, euler.z + zValue);

        this._cameraNode!.eulerAngles = shakeEuler;
    }

    private _setTraumaToZero(dt : number){
        if (!this._freezeTrauma)
            this.trauma -= dt / 2;
    }

    private _drawTraumaAndShakeForce(){

        let camera = this._camera;
        let painter = this._painter;

        drawLine(100, this._trauma, Color.RED);
        drawLine(150, this._shakeForce / 1, Color.BLUE);

        function drawLine(xPos : number, percent : number, color : Color){
            let startV3 = new Vec3();
            let endV3 = new Vec3();

            camera?.screenToWorld(new Vec3(xPos, 100, 0), startV3);
            camera?.screenToWorld(new Vec3(xPos, 100 + 600 * percent, 0), endV3);
            painter?.setStrokeColor(color);
            painter?.drawLine(new Vec2(startV3.x, startV3.y), new Vec2(endV3.x, endV3.y));
        }
    }
}

let CameraMgr = new CameraManager();
export { CameraMgr }