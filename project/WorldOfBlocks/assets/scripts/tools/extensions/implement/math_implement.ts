Number.prototype.addWithLimit = function(this : number, value : number, limit: number){
    let newValue = Number(this) + value;
    return newValue > limit ? limit : newValue;
}

export {};