class GameHelper{
    isSameArray(arr1 : Array<any>, arr2 : Array<any>){
        if(typeof(arr1) != typeof(arr2))
            return false;

        if (arr1.length != arr2.length)
            return false;
        
        arr1.forEach((v, i) => {
            if (!arr2.find(v2 => v2 == v))
                return false;
        });

        arr2.forEach((v, i) => {
            if (!arr1.find(v2 => v2 == v))
                return false;
        });

        return true;
    }
}

let Helper = new GameHelper();
export {Helper};