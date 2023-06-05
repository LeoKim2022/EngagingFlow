/**
 * Determines if a point is inside a bounding rectangle.
 *
 * @param {Object} pointA - The point to be checked.
 * @param {Object} elementB - The bounding rectangle to be checked against.
 * @returns {boolean} - Returns true if the point is inside the bounding rectangle, false otherwise.
 */
function isAPointInBRect(pointA, elementB) {
    if(
        pointA.y >= elementB.top &&
        pointA.x >= elementB.left &&
        pointA.x <= elementB.right &&
        pointA.y <= elementB.bottom
    ) {
        return(true);
    } else {
        return(false);
    }
}



/**
 * Checks if elementA is inside elementB, considering their position and dimensions.
 *
 * @param {Object} elementA - The first element with properties: top, left, right, bottom.
 * @param {Object} elementB - The second element with properties: top, left, right, bottom.
 * @returns {boolean} Returns true if elementA is inside elementB, otherwise returns false.
 */
function isARectInBRect(elementA, elementB) {
    if(
        elementA.top >= elementB.top &&
        elementA.left >= elementB.left &&
        elementA.right <= elementB.right &&
        elementA.bottom <= elementB.bottom
    ) {
        return(true);
    } else {
        return(false);
    }
}



/**
 * Checks if the input array is empty
 * @param {Array} array - The input array to check for being empty.
 * @returns {boolean} - Returns true if the input array is empty or not an array, otherwise false.
 */
function isEmptyArray(array) {
    if(Array.isArray(array) && array.length > 0) {
        return(false);
    } else {
        return(true);
    }
}



/**
 * Compares values of two parameters, either objects or primitives
 * @param {object} param1 First input value for the comparison.
 * @param {object} param2 Second input value for the comparison.
 * @returns {boolean} - Returns true if both the inputs are equal, otherwise false.
 */
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

export {isAPointInBRect, isARectInBRect, isEmptyArray, compareObjectValue}