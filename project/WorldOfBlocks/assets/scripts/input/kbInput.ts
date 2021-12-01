import { _decorator, systemEvent, EventKeyboard, SystemEvent } from 'cc';

export class KBInput{
    private pressd_map: any = {};
    private just_pressd_map: any = {};
    private just_released_map: any = {};

    constructor() {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, (e: EventKeyboard) => {
            this.Set_Pressed_Status(e.keyCode, true);
            this.Set_Released_Status(e.keyCode, false);
        }, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, (e: EventKeyboard) => {
            this.Set_Pressed_Status(e.keyCode, false);
            this.Set_Released_Status(e.keyCode, true);
        }, this);
    }

    // 标记按键是否按下
    private Set_Pressed_Status(k: number, status: boolean) {
        if (status != false && !!this.pressd_map[k]) {
            return;
        }

        this.pressd_map[k] = status;
        this.just_pressd_map[k] = status;
    }

    // 标记按键松开状态
    private Set_Released_Status(k: number, status: boolean) {
        this.just_released_map[k] = status;
    }

    // 获取按键按压状态
    GetKeyDown(k: number) {
        return !!this.pressd_map[k];
    }

    // 获取按键按压状态（仅一次）
    GetKey(k: number) {
        let pressed_status = this.just_pressd_map[k];
        this.just_pressd_map[k] = false;
        return !!pressed_status;
    }

    // 获取按键松开状态（仅一次）
    GetKeyUp(k: number) {
        let released_status = this.just_released_map[k];
        this.just_released_map[k] = false;
        return !!released_status;
    }
}