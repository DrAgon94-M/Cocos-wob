import { Node, Size, Tween, tween, TweenSystem, UITransform, Vec3 } from "cc";

const SCALE_GROUP = 1;
const ROTATION_GROUP = 2;

class AnimationInfo {
    readonly name: string;
    readonly tween: Tween<Node>;

    constructor(name: string, tween: Tween<Node>) {
        this.name = name;
        this.tween = tween;
    }
}

export class Animation {
    private _model: Node;
    private _uiTransform: UITransform;

    private _curAnims = new Map<number, AnimationInfo>();

    private _originSize: Size = new Size(100, 100);
    private _originScale: Vec3 = new Vec3(0.9, 1.4, 1);
    private _standEuler: number = 0;
    private _idleScale: Vec3 = new Vec3(0.95, 1.35, 1);
    private _moveMaxAngle: number = 10;
    private _moveInAirMaxAngle : number = 15;
    private _oneJumpStartScale: Vec3 = new Vec3(1.2, 1.1, 1);
    private _oneJumpLeaveGroundScale: Vec3 = new Vec3(0.7, 1.6, 1);
    private _doubleJumpStartScale: Vec3 = new Vec3(1.15, 1.15, 1);

    constructor(model: Node) {
        this._model = model
        this._uiTransform = model.getComponent(UITransform) as UITransform;
    }

    private get _curEuler_Y() {
        return this._model.eulerAngles.y;
    }

    private get _curEuler_Z(){
        return this._model.eulerAngles.z;
    }


    async playStop() {

    }

    playIdle() {
        if (this._model.eulerAngles.z != this._standEuler) {
            this._toOriginRotation();
        }

        this._tween("idle", SCALE_GROUP)
            ?.to(0.8, { scale: this._idleScale }, { easing: "cubicOut" })
            .to(0.8, { scale: this._originScale }, { easing: "cubicOut" })
            .union()
            .repeatForever()
            .start()
    }

    playMove(speedScale: number) {
        let angle = speedScale * this._moveMaxAngle;

        if (this._curEuler_Z != angle)
            this._playRotation("move", -angle);
    }

    playMoveInAir(speedScale : number){
        let angle = speedScale * this._moveInAirMaxAngle;

        if (this._curEuler_Z != angle)
            this._playRotation("moveInAir", angle, 0.5);
    }

    async playOneJumpStart() {
        await this._playScale("oneJumpStart", this._oneJumpStartScale, .05);
    }

    async playOneJumpLeaveGround() {
        await this._playScale("oneJumpLeaveGround", this._oneJumpLeaveGroundScale, .05);
        
        return this._toOriginScale(0.5);
    }

    async playDoubleJumpStart() {

    }

    async playFall() {

    }

    async playFallToGround() {
        await this.playOneJumpStart();
        return this._toOriginScale();
    }

    playDashStart() { }
    playDashing() { }
    playDashFinish() { }
    playDied() { }

    private _tween(animName: string, group: number) {
        if (this._isShowing(animName, group))
            return null;

        this._stopOldAnim(group);

        return this._startNewAnim(animName, group).tween;
    }

    private _isShowing(animName: string, group: number) {
        let animInfo = this._curAnims.get(group);
        //如果该组的缓动已经播放完了，直接返回false
        let action = TweenSystem.instance.ActionManager.getActionByTag(group, this._model);
        if (!action || action.isDone())
            return false;
        //如果没播放完，查看是不是同一个名字，是返回true；否则返回false
        return animInfo?.name == animName;
    }

    private _stopOldAnim(group: number) {
        this._curAnims.get(group)?.tween.stop();
    }

    private _startNewAnim(animName: string, group: number) {
        let tweenIns = tween(this._model).tag(group);
        let newInfo = new AnimationInfo(animName, tweenIns);
        this._curAnims.set(group, newInfo);
        return newInfo;
    }

    private _toOriginScale(duration ?: number) {
        if (this._model.scale.equals(this._originScale))
            return null;

        return this._playScale("toOriginnScale", this._originScale, duration);
    }

    private _toOriginRotation(duration ?: number) {
        if (this._curEuler_Z == this._standEuler)
            return null;

        return this._playRotation("toOriginRotation", this._standEuler, duration);
    }

    private _playScale(animName: string, scale: Vec3, duration: number = 0.1) {
        return new Promise<void>((resolve, reject) => {
            this._tween(animName, SCALE_GROUP)
                ?.to(duration, { scale: scale }, { easing: "linear", onComplete: () => resolve() })
                .start();
        });
    }

    private _playRotation(animName: string, euler: number, duration: number = 0.1) {
        return new Promise<void>((resolve, reject) => {
            this._tween(animName, ROTATION_GROUP)
                ?.to(duration, { eulerAngles: new Vec3(0, this._curEuler_Y, euler) }, { easing: "linear", onComplete: () => resolve() })
                .start();
        });
    }

    private _setAnchor(x: number, y: number) {
        let pos = this._model.position
        let lastAnchorY = this._uiTransform.anchorY
        let diff = y - lastAnchorY

        this._model.position = new Vec3(pos.x, pos.y + diff * this._originSize.y, pos.z)

        this._uiTransform.anchorX = x;
        this._uiTransform.anchorY = y;
    }

    private _stopAllAnim() {
        this._curAnims.forEach(info => info.tween.stop());
        this._curAnims.clear();
    }
}