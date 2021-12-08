import { animation, IQuatLike, Node, Quat, Size, Tween, tween, UITransform, Vec2, Vec3 } from "cc";

class AnimationInfo{
    readonly name : string;
    readonly tween : Tween<Node>;

    constructor(name : string, tween : Tween<Node>){
        this.name = name;
        this.tween = tween;
    }
}

class AnimationDefineData{
    readonly name : string;
    readonly group : number;

    constructor(name : string, group : number){
        this.name = name;
        this.group = group;
    }
}

class AnimationDefine{
    static readonly idle = new AnimationDefineData("idle", 1);
    static readonly move = new AnimationDefineData("move", 1);
    static readonly oneJumpStart = new AnimationDefineData("oneJumpStart", 1);
    static readonly oneJumpLeaveGround = new AnimationDefineData("oneJumpLeaveGround", 1);
    static readonly doubleJumpStart = new AnimationDefineData("doubleJumpStart", 1);
    static readonly doubleJumpRotate = new AnimationDefineData("doubleJumpRotate", 1);
    static readonly fall = new AnimationDefineData("fall", 1);
    static readonly fallToGround = new AnimationDefineData("fallToGround", 1);
    static readonly dashStart = new AnimationDefineData("dashStart", 1);
    static readonly dashing = new AnimationDefineData("dashing", 1);
    static readonly dashFinish = new AnimationDefineData("dashFinish", 1);
    static readonly died = new AnimationDefineData("died", 1);
}

export class Animation{
    private _model : Node;
    private _uiTransform : UITransform;

    private _curAnims = new Map<number, AnimationInfo>();
    private _curMoveScale : number = 0;

    private _originSize : Size = new Size(100, 100);
    private _originScale : Vec3 = new Vec3(0.9, 1.4, 1);
    private _idleScale : Vec3 = new Vec3(0.95, 1.35, 1);
    private _moveMaxAngle : number = 10;
    private _oneJumpStartScale : Vec3 = new Vec3(1.1, 1.2, 1);
    private _oneJumpLeaveGroundScale : Vec3 = new Vec3(0.7, 1.6, 1);
    private _doubleJumpStartScale : Vec3 = new Vec3(1.15, 1.15, 1);

    constructor(model : Node){
        this._model = model
        this._uiTransform = model.getComponent(UITransform) as UITransform;
    }

    private get _curEuler_Y(){
        return this._model.eulerAngles.y;
    }

    private get _standEuler(){
        return new Vec3(0, this._curEuler_Y, 0);
    }

    stop(){
        if(this._curAnims.size != 0) {

            this._stopAllTween();
            this._curMoveScale = 0;

            this._setScaleTo(this._originScale);
            this._setRotationTo(this._standEuler);
        }
    }

    playIdle(){
        if (this._model.eulerAngles != this._standEuler){
            this._setRotationTo(this._standEuler);
        }

        this._tween(AnimationDefine.idle)
            ?.to(0.8, {scale : this._idleScale}, {easing : "cubicOut"})
            .to(0.8, {scale : this._originScale}, {easing : "cubicOut"})
            .union()
            .repeatForever()
            .start()
    }

    playMove(speedScale : number){
        let angle = speedScale * this._moveMaxAngle;

        if (speedScale != this._curMoveScale){

            this._curMoveScale = speedScale;
            
            this._setRotationTo(new Vec3(0, this._curEuler_Y, -angle));
        }

        this._tween(AnimationDefine.move)
            ?.to(0.5, {eulerAngles : new Vec3(0, this._curEuler_Y, -angle + 2)}, {easing : "cubicOut"})
            .to(0.5, {eulerAngles : new Vec3(0, this._curEuler_Y, -angle)}, {easing : "linear"})
            .union()
            .repeatForever()
            .start()
    }

    async playOneJumpStart() {
        return new Promise<void>((reslove, reject) => {
        this._tween(AnimationDefine.oneJumpStart)
            ?.to(0.1, {scale : this._oneJumpStartScale}, {easing : "linear", onComplete : () =>{
                reslove();
            }})
            .start();
        })
    }

    async playOneJumpLeaveGround(){
        return new Promise<void>((reslove, reject) => {
            this._tween(AnimationDefine.oneJumpLeaveGround)
                ?.to(0.1, {scale : this._oneJumpLeaveGroundScale}, {easing : "linear", onComplete : () =>{
                    reslove();
                }})
                .start();
                
        });
    }

    async playDoubleJumpStart() {
        return new Promise<void>((reslove, reject) => {

            this._tween(AnimationDefine.doubleJumpStart)
                ?.to(0.1, {scale : this._doubleJumpStartScale}, {easing : "linear", onComplete : () =>
                    {   
                        this._setAnchor(0.5, 0.5)
                        this._tween(AnimationDefine.doubleJumpRotate)
                            ?.to(0.25, {eulerAngles : new Vec3(0, this._curEuler_Y, -180)}, {easing : "linear", onComplete : () =>{
                                this._model.eulerAngles = this._standEuler;                               
                            }})
                            .repeat(2)
                            .union()
                            .start();
                }})
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
        await this.playOneJumpStart()
    }

    playDashStart() {}
    playDashing() {}
    playDashFinish() {}
    playDied() {}

    private _tween(data : AnimationDefineData){
        if (this._isShowing(data)) 
        {
            return null;
        }
        else
        {
            this._stopOldAnim(data.group);
            return this._startNewAnim(data).tween;
        }
    }

    private _isShowing(data : AnimationDefineData){
        return this._curAnims.get(data.group)?.name == data.name;
    }

    private _stopOldAnim(group : number){
        this._curAnims.get(group)?.tween.stop();
    }

    private _startNewAnim(data : AnimationDefineData){
        let newInfo = new AnimationInfo(data.name, tween(this._model));
        this._curAnims.set(data.group, newInfo);
        return newInfo;
    }

    private _setScaleTo(scale : Vec3) {
        tween(this._model)
            .to(0.2, {scale : scale}, {easing : "linear"})
            .start()
    }

    private _setRotationTo(euler : Vec3){
        tween(this._model)
            .to(0.2, {eulerAngles : euler}, {easing : "linear"})
            .start()
    }

    private _setAnchor(x : number, y : number){
        let pos = this._model.position
        let lastAnchorY = this._uiTransform.anchorY
        let diff = y - lastAnchorY

        this._model.position = new Vec3(pos.x, pos.y + diff * this._originSize.y, pos.z)

        this._uiTransform.anchorX = x;
        this._uiTransform.anchorY = y;
    }

    private _stopAllTween(){
        this._curAnims.forEach(info => info.tween.stop());
        this._curAnims.clear();
    }
}