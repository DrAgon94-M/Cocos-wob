declare global{
    interface Number{
        addWithLimit(value : number, limit : number) : void;
    }
}

export {};