class ActionEvent {
    readonly _event: (() => void);
    readonly _target: unknown;

    constructor(event: (() => void), target: unknown) {
        this._event = event;
        this._target = target;
    }

    invoke() {
        this._event.call(this._target);
    }
}

export class EventMgr {
    allEvents = new Map<string, Map<number, ActionEvent>>();

    addListener(eventName: string, callBack: () => void, target: unknown) {
        let events = this.allEvents.get(eventName)

        if (!events){
            events = new Map<number, ActionEvent>();
            this.allEvents.set(eventName, events);
        }
        
        let id = events.size;
        events.set(id, new ActionEvent(callBack, target));

        return eventName + "_" + id;
    }

    removeListener(key: string) {
        let arrs = key.split("_");
        let eventName = arrs[0];
        let id = Number(arrs[1]);

        this.allEvents.get(eventName)?.delete(id);
    }

    emit(eventName: string) {
        this.allEvents.get(eventName)?.forEach((e) => {
            e.invoke();
        });
    }
}