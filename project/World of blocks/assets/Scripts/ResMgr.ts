import { Asset, error, instantiate, Prefab, resources } from "cc";

class ResMgr {

    load<T extends Asset>(path: string) {
    
        return new Promise<T>((reslove, reject) => {

            resources.load<T>(path, (err, asset) => {

                if (!err) {
                    reslove(asset);
                }
                else {
                    error(err);
                    reject(err);
                }

            });

        });

    }

    /**
     * 返回初始化好的预制体
     * @param path 预制体的路径，从 "resources/Prefabs/" 开始的路径
     * @example let uiNode = await ResManager.loadPrefab("UI/UIOperation")
    */
    async loadPrefab(path : string){
        let prefab = await this.load<Prefab>("Prefabs/" + path);
        return instantiate(prefab);
    }
}

export default new ResMgr();