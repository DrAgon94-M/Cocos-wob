import { Component, Node } from "cc";

class GameHelper extends Component{
    isSameArray(arr1 : Array<any>, arr2 : Array<any>){
        let result = true;

        if(typeof(arr1) != typeof(arr2))
            return false;

        if (arr1.length != arr2.length)
            return false;
        
        arr1.forEach((v1, i) => {
            if (!arr2.find(v2 => v2 == v1))
                result = false;
        });

        arr2.forEach((v2, i) => {
            if (!arr1.find(v1 => v1 == v2))
                result = false;
        });
        
        return result;
    }
}

let helperNode = new Node("GameHelper");
let Helper = helperNode.addComponent(GameHelper);

export {Helper};