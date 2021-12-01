
import { _decorator, Node, error, Widget } from 'cc';
import ResMgr from '../../ResMgr';
import SceneMgr from '../../SceneMgr';
import UIBase from './UIBase/UIBase';
import { UIType } from './UIEnum';

class UIMgr {

    private _screenLayer: Node | null = null;
    private _fixedLayer: Node | null = null;
    private _popUpLayer: Node | null = null;
    private _tipsLayer: Node | null = null;

    private _loaded = new Map<string, UIBase>();

    async lateInit() {
        this._createLayer();
    }

    async openForm(path: string) {
        let uiBase = this._loaded.get(path);

        if (!uiBase) {
            uiBase = await this._loadForm(path);
        }
        else if (uiBase.isShowing == true) {
            error(`该窗口 [${path}] 已经打开！`);
            return;
        }

        await this._showForm(uiBase);
    }

    async closeForm(path: string) {
        let uiBase = this._loaded.get(path);

        if (!uiBase) {
            error(`该窗口 [${path}] 尚未加载！`);
            return;
        }
        if (uiBase.isShowing == false) {
            error(`该窗口 [${path}] 尚未打开！`);
            return;
        }

        await this._hideForm(uiBase);
    }

    async destroyForm(path: string) {
        let uiBase = this._loaded.get(path);
        if (!uiBase) {
            error(`该窗口 [${path}] 尚未加载！`);
            return;
        }

        if (uiBase.isShowing == true)
            this._hideForm(uiBase);

        uiBase?.destroy();

        this._loaded.delete(path);
    }

    private _createLayer() {
        let uiRoot = SceneMgr.uiRoot;

        uiRoot?.addChild(this._screenLayer = new Node("Screen"));
        uiRoot?.addChild(this._fixedLayer  = new Node("Fixed" ));
        uiRoot?.addChild(this._popUpLayer  = new Node("PopUp" ));
        uiRoot?.addChild(this._tipsLayer   = new Node("Tips"  ));
    }

    private _addToLayer(uiNode: Node, type: UIType) {
        switch (type) {
            case UIType.Screen:
                this._screenLayer?.addChild(uiNode);
                break;
            case UIType.Fixed:
                this._fixedLayer?.addChild(uiNode);
                break;
            case UIType.PopUp:
                this._popUpLayer?.addChild(uiNode);
                break;
            case UIType.Tips:
                this._tipsLayer?.addChild(uiNode);
                break;
        }
    }

    private async _loadForm(path: string) {
        let uiNode = await ResMgr.loadPrefab("UI/" + path);
        let uiBase = uiNode.getComponent("UIBase") as UIBase;

        this._addToLayer(uiNode, uiBase.type);
        this._loaded.set(path, uiBase);

        //使 UI 对齐画布
        let canvas = SceneMgr.Canvas
        let widget = uiNode.getComponent(Widget);
        widget!.target = canvas;

        return uiBase;
    }

    private async _showForm(uiBase: UIBase) {
        uiBase.beforeShow();
        await uiBase.show();
        uiBase.afterShow();

        await uiBase.showAnim();
    }

    private async _hideForm(uiBase: UIBase) {
        await uiBase.hideAnim();
        console.log("wait for hide anim")
        uiBase.beforeHide();
        await uiBase.hide();
        uiBase.afterHide();
    }
}

export default new UIMgr();