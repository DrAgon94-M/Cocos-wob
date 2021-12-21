import { sys } from "cc";

/** WOB == World of blocks */
class WOB_System{
    get isEngine(){
        return !sys.isNative;
    }

    /** 
     * 游戏的最小单位长度
     */
    get minUnit(){
        return 50;
    }
}

let WOBSystem = new WOB_System();
export { WOBSystem }