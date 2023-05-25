import * as DEFINITION from '../engaging_flow/definition'
// import {isEmptyArray} from '../function/common'

const breakPoint = 0.5;

function connectPath(params) {

    // fromItem 에서 path가 어느 edge에서 시작할지 판단한다.
    const fromItem = params.fromItem;
    addRightBottom(fromItem);

    const fromNode = params.fromNode;
    addRightBottom(fromNode);

    const toNode = params.toNode;
    addRightBottom(toNode);

    const nearEdgeResult = findStartEdge(params);
    if(!nearEdgeResult) {
        return(null);
    }

    // const nearEdgeResult = nearEdge(fromNode, fromItem);    
    
    // 경계선과 외곽선 사이에서 아이템이 없는 방향 우선
    // const targetEdge = checkObstacle(fromNode, fromItem, nearEdgeResult);
    // if(!targetEdge) return(null);

    const pathPoints = calcPathPoints(nearEdgeResult, params);

    const svgFrom = nearEdgeResult.fromPoint;
    const svgTo   = nearEdgeResult.toPoint;

    return({
        edge: nearEdgeResult.edge,
        svgRect: {
            top: (svgFrom.y < svgTo.y)? svgFrom.y: svgTo.y,
            left: (svgFrom.x < svgTo.x)? svgFrom.x: svgTo.x,
            width: (svgFrom.x < svgTo.x)? (svgTo.x - svgFrom.x): (svgFrom.x - svgTo.x),
            height: (svgFrom.y < svgTo.y)? (svgTo.y - svgFrom.y): (svgFrom.y - svgTo.y),
        },

        fromNode: fromNode,
        toNode: toNode,

        fromPoint: nearEdgeResult.fromPoint,
        toPoint: nearEdgeResult.toPoint,

        pathPoints: pathPoints,
        itemPointerSize: params.itemPointerSize,
        nodePointerSize: params.nodePointerSize,
    });
    
}



/**
 * 
 * @param rect 
 */
function addRightBottom(rect) {
    rect.right  = rect.left + rect.width;
    rect.bottom = rect.top + rect.height;
}



/**
 * 
 * @param nearEdgeResult 
 */
function calcPathPoints(nearEdgeResult, params) {

    const edge = nearEdgeResult.edge;
    
    const searchPathParam = JSON.parse(JSON.stringify({
        edge: edge,
        fromNode: params.fromNode,
        fromPoint: nearEdgeResult.fromPoint,
        wayPoint: nearEdgeResult.fromPoint,
        toNode: params.toNode,
        toPoint: nearEdgeResult.toPoint,
        itemPointerSize: params.itemPointerSize,
        nodePointerSize: params.nodePointerSize,
    }));

    const pointers = [];
    searchPathParam.pointers = pointers;

    switch(edge) {
        case 'top':
        case 'bottom': {
            searchPathParam.axis = "y";
            break;
        }
    
        default: {
            searchPathParam.axis = "x";
            break;
        }
    }

    searchPath(searchPathParam);
    return(pointers);
}



/*
function checkObstacle(fromNode, fromItem, nearEdgeResult) {

    let findEdge = null;

    // 경계선 양끝에서 allowancesEdge 만큼 제외 하고 허용
    const allowancesEdge = 0.3;

    const edgeLimit = {
        left:  fromItem.left + (fromItem.width * allowancesEdge),
        right: fromItem.left + (fromItem.width * (1 - allowancesEdge)),
        top: fromItem.top + (fromItem.height * allowancesEdge),
        bottom: fromItem.top + (fromItem.height * (1 - allowancesEdge)),
    }

    nearEdgeResult.forEach((edgeItem) => {
        if(findEdge) return;

        switch(edgeItem.edge) {
            case 'top': {
                let hasObstacle = false;
                if(!isEmptyArray(fromNode.items)) {
                    fromNode.items.forEach(nodeItem => {
                        if(hasObstacle) return;
                        if(nodeItem.id === fromItem.id) return;
                        if(nodeItem.top >= fromItem.top) return;

                        // edge 가운데 그린다고 가정할때, 기준이하로 겹치는 경우는 허용 가능하므로..
                        if(!(nodeItem.right < edgeLimit.left || nodeItem.left > edgeLimit.right)) {
                            hasObstacle = true;
                            return;
                        }
                        
                    });
                }

                if(!hasObstacle) findEdge = edgeItem;
                break;
            }

            case 'right': {
                let hasObstacle = false;
                if(!isEmptyArray(fromNode.items)) {
                    fromNode.items.forEach(nodeItem => {
                        if(hasObstacle) return;
                        if(nodeItem.id === fromItem.id) return;
                        if(nodeItem.right <= fromItem.right) return;

                        if(!(nodeItem.bottom < edgeLimit.top || nodeItem.top > edgeLimit.bottom)) {
                            hasObstacle = true;
                            return;
                        }
                        
                    });
                }
                if(!hasObstacle) findEdge = edgeItem;
                break;
            }

            case 'bottom': {
                let hasObstacle = false;
                if(!isEmptyArray(fromNode.items)) {
                    fromNode.items.forEach(nodeItem => {
                        if(hasObstacle) return;
                        if(nodeItem.id === fromItem.id) return;
                        if(nodeItem.bottom <= fromItem.bottom) return;

                        if(!(nodeItem.right < edgeLimit.left || nodeItem.left > edgeLimit.right)) {
                            hasObstacle = true;
                            return;
                        }
                        
                    });
                }
                if(!hasObstacle) findEdge = edgeItem;
                break;
            }
        
            default: {
                return;
            }
        }
    });

    if(findEdge) {
        return(findEdge);
    } else {
        if(!isEmptyArray(nearEdgeResult)) {
            return(nearEdgeResult[0]);
        } else {
            return(null);
        }
    }

}
*/



/**
 * 
 * @param rect 
 */
function findStartEdge(params) {

    const fromItem = params.fromItem;
    const fromNode = params.fromNode;
    const toNode = params.toNode;

    const nodePointerSize = params.nodePointerSize;
    const itemPointerSize = params.itemPointerSize;

    const edgeResult = {
        edge: '',
        fromPoint: null,
        toPoint: null
    }

    const itemRectFromContainer = {
        top: fromItem.top + fromNode.top,
        left: fromItem.left + fromNode.left,
        right: fromItem.right + fromNode.left,
        bottom: fromItem.bottom + fromNode.top,
        center: {
            x: fromItem.left + (fromItem.width / 2) + fromNode.left,
            y: fromItem.top + (fromItem.height / 2) + fromNode.top,
        }
    }

    const toNodePointer = {
        x: toNode.left - (nodePointerSize.width / 2) + DEFINITION.NODE_INPUT_POINTER_GAP_X,
        y: toNode.top + (toNode.height / 2) + DEFINITION.NODE_INPUT_POINTER_GAP_Y,
    }

    if(
        itemRectFromContainer.top <= toNodePointer.y 
        && itemRectFromContainer.bottom >= toNodePointer.y
        && itemRectFromContainer.left <= toNodePointer.x
        && itemRectFromContainer.right >= toNodePointer.x
    ) {
        // Node의 input point가 fromItem의 내부에 있을 경우 그리지 않는다.
    } else {
        if (
            fromNode.top <= toNodePointer.y 
            && fromNode.bottom >= toNodePointer.y
            && fromNode.left <= toNodePointer.x
            && fromNode.right >= toNodePointer.x
        ) {
            
            if((itemRectFromContainer.right + itemPointerSize.width) < toNodePointer.x) {
                edgeResult.edge = 'right';
            } else {
                if(itemRectFromContainer.center.y < toNodePointer.y) {
                    edgeResult.edge = 'bottom';
                } else {
                    edgeResult.edge = 'top';
                }
            }
            
            edgeResult.isInsideTargetPointer = true;
        } else {
            if(itemRectFromContainer.right + itemPointerSize.width > toNodePointer.x) {
                if(
                    fromNode.top <= toNodePointer.y 
                    && fromNode.bottom >= toNodePointer.y
                    && itemRectFromContainer.center.x < toNodePointer.x
                ) {
                    edgeResult.edge = 'right';
                } else {
                    if(itemRectFromContainer.center.y < toNodePointer.y) {
                        edgeResult.edge = 'bottom';
                    } else {
                        edgeResult.edge = 'top';
                    }
                }
            } else {
                edgeResult.edge = 'right';
            }
            
            edgeResult.isInsideTargetPointer = false;
        }
    }

    if(edgeResult.edge !== '') {

        switch(edgeResult.edge) {
            case 'top': {
                edgeResult.fromPoint = {
                    x: itemRectFromContainer.center.x,
                    y: itemRectFromContainer.top,
                }

                // 노드 두께에 의한 좌표 보정.
                // if(edgeResult.isInsideTargetPointer) {
                    if(itemRectFromContainer) {
                        edgeResult.toPoint = toNodePointer;
                    } else {
                        edgeResult.toPoint = toNodePointer;
                    }
                // }
                break;
            }
        
            case 'bottom': {
                edgeResult.fromPoint = {
                    x: itemRectFromContainer.center.x,
                    y: itemRectFromContainer.bottom,
                }

                // 노드 두께에 의한 좌표 보정.
                // if(edgeResult.isInsideTargetPointer) {
                    if(itemRectFromContainer) {
                        edgeResult.toPoint = toNodePointer;
                    } else {
                        edgeResult.toPoint = toNodePointer;
                    }
                // }
                break;
            }
        
            default: {
                edgeResult.fromPoint = {
                    x: itemRectFromContainer.right,
                    y: itemRectFromContainer.center.y,
                }

                if(edgeResult.isInsideTargetPointer) {
                    edgeResult.toPoint = toNodePointer;
                } else {
                    edgeResult.toPoint = toNodePointer;
                }
                break;
            }
        }

        return(edgeResult);
    } else {
        return(null);
    }
}



/**
 * 
 * @param 
 */
function isOutPoint(firstPoint, fromNode) {
    if(
        fromNode.top + 2 <= firstPoint.y
        && fromNode.bottom + 2 >= firstPoint.y
        && fromNode.left + 2 <= firstPoint.x
        && fromNode.right + 2 >= firstPoint.x
    ) {
        return(false);
    } else {
        return(true);
    }
}


/*
function nearEdge(node, item) {

    const nearEdgeResult = [];

    nearEdgeResult.push({
        edge: 'top',
        distance: item.top,
    });

    nearEdgeResult.push({
        edge: 'bottom',
        distance: node.height - item.bottom,
    });

    nearEdgeResult.push({
        edge: 'right',
        distance: node.width - item.right,
    });

    nearEdgeResult.sort((a, b) => { 
        if(a.distance > b.distance) {
            return(1);
        } else if(a.distance < b.distance) {
            return(-1);
        } else {
            return(0);
        }
    });

    return(nearEdgeResult);
}
*/



function searchPath(searchPathParam) {

    const edge            = searchPathParam.edge;
    const axis            = searchPathParam.axis;
    const fromNode        = searchPathParam.fromNode;
    const fromPoint       = searchPathParam.fromPoint;
    const wayPoint        = searchPathParam.wayPoint;
    // const toNode          = searchPathParam.toNode;
    const toPoint         = searchPathParam.toPoint;
    const itemPointerSize = searchPathParam.itemPointerSize;
    const nodePointerSize = searchPathParam.nodePointerSize;
    const pointers        = searchPathParam.pointers;
    
    if(wayPoint.x !== toPoint.x || wayPoint.y !== toPoint.y) {

        let newPoint = {};

        if(axis === "x") {            
            newPoint.y = wayPoint.y;
            const xDistance = toPoint.x - wayPoint.x;
            if(xDistance >= 0) {
                newPoint.direction = "right";
            } else {
                newPoint.direction = "left";
            }
            
            if(wayPoint.x > toPoint.x) {
                newPoint.x = wayPoint.x + xDistance - nodePointerSize.width;
            } else {
                if(wayPoint.y === toPoint.y) {
                    // 시작점과 동일한 y 위치에서 오른쪽으로 타깃 포인트가 있으면
                    newPoint.x = wayPoint.x + xDistance;
                } else {
                    // 시작점에서 오른쪽으로 타깃 포인트가 없으면 x -> y -> x 순으로 이동해야 하므로.
                    let distanceVal = xDistance * breakPoint;
                    if(distanceVal < itemPointerSize.width) distanceVal = itemPointerSize.width;
                    newPoint.x = wayPoint.x + distanceVal;
                }
            }
        } else {
            newPoint.x = wayPoint.x;            
            let yDistance = toPoint.y - wayPoint.y;
            if(yDistance >= 0) {
                newPoint.direction = "bottom";
            } else {
                newPoint.direction = "top";
            }

            if(newPoint.x === fromPoint.x) { // x가 시작포인트와 동일하고
                if(edge === 'top' && (fromPoint.y - itemPointerSize.height * 2) < toPoint.y) { // 도착점이 시작점보다 탑에서 멀면
                    newPoint.y = wayPoint.y - itemPointerSize.height;
                } else if(edge === 'bottom' && (fromPoint.y + itemPointerSize.height * 2) > toPoint.y) {
                    newPoint.y = wayPoint.y + itemPointerSize.height;
                } else {
                    if(wayPoint.x > toPoint.x) {
                        newPoint.y = wayPoint.y + yDistance * breakPoint;
                    } else {
                        newPoint.y = wayPoint.y + yDistance;
                    }
                }
            } else {
                newPoint.y = wayPoint.y + yDistance;
            }
        }

        const insideFrom = !isOutPoint(wayPoint, fromNode);
        const insideNew = !isOutPoint(newPoint, fromNode);

        if(insideFrom === true) {
            if(insideNew === true) {
                pointers.push(Object.assign({isInside: insideFrom}, newPoint));
            } else {

                const pushPointer = Object.assign({isInside: insideFrom}, newPoint);
                if(axis === "x") {
                    if(wayPoint.x < toPoint.x) {
                        pushPointer.x = fromNode.right;
                        pointers.push(pushPointer);
                            
                    } else {
                        pushPointer.x = fromNode.left;
                        pointers.push(pushPointer);
                    }
                    
                } else {
                    if(wayPoint.y > toPoint.y) {
                        pushPointer.y = fromNode.top;
                        pointers.push(pushPointer);
                    } else {
                        pushPointer.y = fromNode.bottom + (DEFINITION.NODE_INPUT_POINTER_GAP_Y * 2);
                        pointers.push(pushPointer);
                    }    
                }

                pointers.push(newPoint);
            }
        } else {
            pointers.push(newPoint);
        }

        searchPathParam.axis = (axis === "x") ? "y" : "x";
        searchPathParam.wayPoint = newPoint;

        searchPath(searchPathParam);
    }
}

export {connectPath, isOutPoint}