import { Vec2 } from "cc";

export class DashDir {
    static get up() { return new Vec2(0, 1); }
    static get down() { return new Vec2(0, -1); }
    static get left() { return new Vec2(-1, 0); }
    static get right() { return new Vec2(1, 0); }
    static get up_left() { return new Vec2(-1, 1); }
    static get up_right() { return new Vec2(1, 1); }
    static get down_left() { return new Vec2(-1, -1); }
    static get down_right() { return new Vec2(1, -1); }
}