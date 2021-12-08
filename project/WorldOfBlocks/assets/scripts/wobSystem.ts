import { sys } from "cc";

/** WOB == World of blocks */
class WOB_System{
    get isEngine(){
        return !sys.isNative;
    }
}

let WOBSystem = new WOB_System();
export { WOBSystem }