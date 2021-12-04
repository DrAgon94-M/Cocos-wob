import { IQuatLike, Node, Quat, Size, Tween, tween, UITransform, Vec2, Vec3 } from "cc";

export class Animation{
    private _model : Node;
    private _uiTransform : UITransform;

    private _curSouce : string = "";
    private _curTween : Tween<Node> | null = null;
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
        if(this._curSouce != "") {

            this._curTween?.stop()

            this._curSouce = "";
            this._curTween = null;
            this._curMoveScale = 0

            this._setScaleTo(this._originScale);
            this._setRotationTo(this._standEuler);
        }
    }

    playIdle(){
        if (this._model.eulerAngles != this._standEuler){
            this._setRotationTo(this._standEuler);
        }

        this._tween("idle")
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

        this._tween("move" + speedScale.toString())
            ?.to(0.5, {eulerAngles : new Vec3(0, this._curEuler_Y, -angle + 2)}, {easing : "cubicOut"})
            .to(0.5, {eulerAngles : new Vec3(0, this._curEuler_Y, -angle)}, {easing : "linear"})
            .union()
            .repeatForever()
            .start()
    }

    async playOneJumpStart() {
        return new Promise<void>((reslove, reject) => {
        this._tween("oneJumpStart")
            ?.to(0.1, {scale : this._oneJumpStartScale}, {easing : "linear", onComplete : () =>{
                reslove();
            }})
            .start();
        })
    }

    async playOneJumpLeaveGround(){
        return new Promise<void>((reslove, reject) => {
            this._tween("oneJumpLeaveGround")
                ?.to(0.1, {scale : this._oneJumpLeaveGroundScale}, {easing : "linear", onComplete : () =>{
                    reslove();
                }})
                .start();
                
        });
    }

    async playDoubleJumpStart() {
        return new Promise<void>((reslove, reject) => {

            this._tween("doubleJumpStart")
                ?.to(0.1, {scale : this._doubleJumpStartScale}, {easing : "linear", onComplete : () =>
                    {   
                        this._setAnchor(0.5, 0.5)
                        this._tween("doubleJumpRotate")
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

    private _tween(source : string){
        if (this._curSouce == source) 
        {
            return null;
        }
        else
        {
            this._curSouce = source;
            this._curTween?.stop();
            this._curTween = tween(this._model);
            return this._curTween;
        }
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

}