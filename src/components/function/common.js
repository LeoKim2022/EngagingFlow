function isEmptyArray(array) {
    if(Array.isArray(array) && array.length > 0) {
        return(false);
    } else {
        return(true);
    }
}

export {isEmptyArray}