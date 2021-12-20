export class Attr{
    //for controller
    get toStaticTime(){
        return 2;
    }

    // for motor
    get moveSpeed(){
        return 15;
    }
    get oneJumpForce(){
        return 20;
    }
    get oneJumpHeldForce(){
        return 2.5;
    }
    get oneJumpHeldDuration(){
        return 0.2;
    }
    get dashingForce(){
        return 60;
    }
    get dashDuration(){
        return 0.2;
    }
    get dashFinishForce(){
        return 30;
    }
}