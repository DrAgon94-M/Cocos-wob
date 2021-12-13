import { animation, IQuatLike, Node, Quat, Size, Tween, tween, TweenSystem, UITransform, Vec2, Vec3 } from "cc";

//一些特殊的组，特别标识
const STOP_OTHER_GROUP = 100;

class AnimationInfo {
    readonly name: string;
    readonly tween: Tween<Node>;

    constructor(name: string, tween: Tween<Node>) {
        this.name = name;
        this.tween = tween;
    }
}

class AnimationDefineData {
    readonly name: string;
    readonly group: number;

    constructor(name: string, group: number) {
        this.name = name;
        this.group = group;
    }
}

class AnimationDefine {
    static readonly stop = new AnimationDefineData("stop", STOP_OTHER_GROUP);
    static readonly toOriginScale = new AnimationDefineData("toOriginScale", STOP_OTHER_GROUP);
    static readonly toOriginRotation = new AnimationDefineData("toOriginRotation", STOP_OTHER_GROUP);
    static readonly idle = new AnimationDefineData("idle", STOP_OTHER_GROUP);
    static readonly move = new AnimationDefineData("move", 1);
    static readonly oneJumpStart = new AnimationDefineData("oneJumpStart", 2);
    static readonly oneJumpLeaveGround = new AnimationDefineData("oneJumpLeaveGround", 2);
    static readonly doubleJumpStart = new AnimationDefineData("doubleJumpStart", 2);
    static readonly doubleJumpRotate = new AnimationDefineData("doubleJumpRotate", 2);
    static readonly fall = new AnimationDefineData("fall", 1);
    static readonly fallToGround = new AnimationDefineData("fallToGround", 2);
    static readonly dashStart = new AnimationDefineData("dashStart", 1);
    static readonly dashing = new AnimationDefineData("dashing", 1);
    static readonly dashFinish = new AnimationDefineData("dashFinish", 1);
    static readonly died = new AnimationDefineData("died", 1);
}

export class Animation {
    private _model: Node;
    private _uiTransform: UITransform;

    private _curAnims = new Map<number, AnimationInfo>();

    private _originSize: Size = new Size(100, 100);
    private _originScale: Vec3 = new Vec3(0.9, 1.4, 1);
    private _idleScale: Vec3 = new Vec3(0.95, 1.35, 1);
    private _moveMaxAngle: number = 10;
    private _oneJumpStartScale: Vec3 = new Vec3(1.1, 1.2, 1);
    private _oneJumpLeaveGroundScale: Vec3 = new Vec3(0.7, 1.6, 1);
    private _doubleJumpStartScale: Vec3 = new Vec3(1.15, 1.15, 1);

    constructor(model: Node) {
        this._model = model
        this._uiTransform = model.getComponent(UITransform) as UITransform;
    }

    private get _curEuler_Y() {
        return this._model.eulerAngles.y;
    }

    private get _standEuler() {
        return new Vec3(0, this._curEuler_Y, 0);
    }

    async playStop() {
        this._tween(AnimationDefine.stop)
            ?.to(0.1, { scale: this._originScale, eulerAngles: this._standEuler }, { easing: "linear" })
            .start();
    }

    playIdle() {
        if (this._model.eulerAngles != this._standEuler) {
            this._toOriginRotation();
        }

        this._tween(AnimationDefine.idle)
            ?.to(0.8, { scale: this._idleScale }, { easing: "cubicOut" })
            .to(0.8, { scale: this._originScale }, { easing: "cubicOut" })
            .union()
            .repeatForever()
            .start()
    }

    playMove(speedScale: number) {
        if (speedScale == 0) {
            this._toOriginRotation();
            return;
        }

        let angle = speedScale * this._moveMaxAngle;

        this._tween(AnimationDefine.move)
            ?.to(0.5, { eulerAngles: new Vec3(0, this._curEuler_Y, -angle) }, { easing: "linear" })
            .union()
            .repeatForever()
            .start()
    }

    playOneJumpStart() {
        return new Promise<void>((reslove, reject) => {
            this._tween(AnimationDefine.oneJumpStart)
                ?.to(0.1, { scale: this._oneJumpStartScale }, {
                    easing: "linear", onComplete: () => {
                        reslove();
                    }
                })
                .start();
        })
    }

    async playOneJumpLeaveGround() {
        return new Promise<void>((reslove, reject) => {
            this._tween(AnimationDefine.oneJumpLeaveGround)
                ?.to(0.1, { scale: this._oneJumpLeaveGroundScale }, {
                    easing: "linear", onComplete: () => {
                        reslove();
                    }
                })
                .start();

        });
    }

    async playDoubleJumpStart() {
        return new Promise<void>((reslove, reject) => {

            this._tween(AnimationDefine.doubleJumpStart)
                ?.to(0.1, { scale: this._doubleJumpStartScale }, {
                    easing: "linear", onComplete: () => {
                        this._setAnchor(0.5, 0.5)
                        this._tween(AnimationDefine.doubleJumpRotate)
                            ?.to(0.25, { eulerAngles: new Vec3(0, this._curEuler_Y, -180) }, {
                                easing: "linear", onComplete: () => {
                                    this._model.eulerAngles = this._standEuler;
                                }
                            })
                            .repeat(2)
                            .union()
                            .start();
                    }
                })
                .start()

            setTimeout(() => {
                this._model.eulerAngles = this._standEuler;
                this._setAnchor(0.5, 0)
                reslove()
            }, 0.35 * 1000);

        });
    }

    async playFall() {

    }
    async playFallToGround() {
        await this.playOneJumpStart();
        this._toOriginScale();
    }

    playDashStart() { }
    playDashing() { }
    playDashFinish() { }
    playDied() { }

    private _tween(data: AnimationDefineData) {
        return this._tween2(data.name, data.group);
    }

    private _tween2(animName: string, group: number) {
        if (this._isShowing(animName, group))
            return null;

        if (group == STOP_OTHER_GROUP)
            this._stopAllAnim();
        else
            this._stopOldAnim(group);

        return this._startNewAnim(new AnimationDefineData(animName, group)).tween;
    }

    private _isShowing(animName : string, group : number) {
        let animData = this._curAnims.get(group);
        //如果该缓动已经播放完了，直接返回false
        let action = TweenSystem.instance.ActionManager.getActionByTag(group, this._model);
        if (!action || action.isDone())
            return false;
        //如果没播放完，查看是不是同一个名字，是返回true；否则返回false
        return animData?.name == animName;
    }

    private _stopOldAnim(group: number) {
        this._curAnims.get(group)?.tween.stop();
    }

    private _startNewAnim(data: AnimationDefineData) {
        let tweenIns = tween(this._model).tag(data.group);
        let newInfo = new AnimationInfo(data.name, tweenIns);
        this._curAnims.set(data.group, newInfo);
        return newInfo;
    }

    private _toOriginScale() {
        this._tween(AnimationDefine.toOriginScale)
            ?.to(0.1, { scale: this._originScale })
            .start();
    }

    private _toOriginRotation() {
        this._tween(AnimationDefine.toOriginScale)
            ?.to(0.1, { eulerAngles: this._standEuler })
            .start();
    }

    private _playScale(scaleX: number, scaleY: number, duration: number = 0.1) {
        tween(this._model)
            .to(duration, { scale: new Vec3(0, scaleY, scaleX) })
            .start();
    }

    private _playRotation(euler: number, duration: number = 0.1) {
        tween(this._model)
            .to(duration, { eulerAngles: new Vec3(0, this._curEuler_Y, euler) })
            .start();
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