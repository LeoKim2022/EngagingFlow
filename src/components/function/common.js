function isEmptyArray(array) {
    if(Array.isArray(array) && array.length > 0) {
        return(false);
    } else {
        return(true);
    }
}

function compareObjectValue(param1, param2) {
    if (typeof param1 !== 'object' || typeof param2 !== 'object') {
        return param1 === param2; // 두 값이 모두 객체가 아닌 경우 일반 비교 연산 사용
    }

    const keys1 = Object.keys(param1);
    const keys2 = Object.keys(param2);

    if (keys1.length !== keys2.length) {
        return false; // 두 객체의 속성 수가 다른 경우 false 반환
    }

    for (let key of keys1) {
        if (!param2.hasOwnProperty(key) || !compareObjectValue(param1[key], param2[key])) {
            return false; // obj2에 key가 없거나, obj1[key]와 obj2[key]가 다른 경우 false 반환
        }
    }

    return true; // 모든 비교가 통과한 경우 true 반환
}

export {isEmptyArray, compareObjectValue}