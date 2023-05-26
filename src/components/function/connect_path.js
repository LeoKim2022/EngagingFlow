import {DEFINITION} from '../engaging_flow/definition'

const breakPoint = 1 / 2;

function connectPath(params) {

    const fromItem = params.fromItem;
    addRightBottom(fromItem);

    const fromNode = params.fromNode;
    addRightBottom(fromNode);

    const toNode = params.toNode;
    addRightBottom(toNode);

    // 아이템 포인터가 생기는 edge
    const nearEdgeResult = findStartEdge(params);
    if(!nearEdgeResult) {
        return(null);
    }

    // path 경로 생성
    const pathPoints = makePathPoints(nearEdgeResult, params);
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
function makePathPoints(nearEdgeResult, params) {

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

    // flow container 부터의 상대 위치
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
        y: toNode.top + toNode.height / 2,
    }

    // 아이템에서 fromPoint가 시작할 위치 판단
    if(
        itemRectFromContainer.top <= toNodePointer.y 
        && itemRectFromContainer.bottom >= toNodePointer.y
        && itemRectFromContainer.left <= toNodePointer.x
        && itemRectFromContainer.right >= toNodePointer.x
    ) {
        // Node의 input point가 fromItem의 내부에 있을 경우 그리지 않으므로
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

    // 아이템에서 fromPoint가 시작할 위치에 따라 fromPoint 설정
    if(edgeResult.edge !== '') {

        switch(edgeResult.edge) {
            case 'top': {
                edgeResult.fromPoint = {
                    x: itemRectFromContainer.center.x,
                    y: itemRectFromContainer.top,
                }

                break;
            }
        
            case 'bottom': {
                edgeResult.fromPoint = {
                    x: itemRectFromContainer.center.x,
                    y: itemRectFromContainer.bottom,
                }

                break;
            }
        
            default: {
                edgeResult.fromPoint = {
                    x: itemRectFromContainer.right - DEFINITION.ITEM_POINTER_GAP_X,
                    y: itemRectFromContainer.center.y,
                }
                
                break;
            }
        }

        edgeResult.toPoint = toNodePointer;
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
        fromNode.top <= firstPoint.y
        && fromNode.bottom >= firstPoint.y
        && fromNode.left <= firstPoint.x
        && fromNode.right >= firstPoint.x
    ) {
        return(false);
    } else {
        return(true);
    }
}



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
                // 새로운 포인터가 Node 영역을 벗어났을때
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
                        pushPointer.y = fromNode.bottom;
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