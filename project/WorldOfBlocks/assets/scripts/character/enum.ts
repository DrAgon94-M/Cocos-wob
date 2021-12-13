import { Vec2 } from "cc";

export class DashDir{
    static readonly up = new Vec2(0, 1);
    static readonly down = new Vec2(0, -1);
    static readonly left = new Vec2(-1, 0);
    static readonly right = new Vec2(1, 0);
    static readonly up_left = new Vec2(-1, 1);
    static readonly up_right = new Vec2(1, 1);
    static readonly down_left = new Vec2(-1, -1);
    static readonly down_right = new Vec2(1, -1);
}