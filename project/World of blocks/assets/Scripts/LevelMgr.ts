import { Vec3 } from "cc";

class LevelMgr{
    private _resetPos : Vec3 = new Vec3(0, 0, 0);

    get resetPos(){
        return this._resetPos;
    }
}

export default new LevelMgr();