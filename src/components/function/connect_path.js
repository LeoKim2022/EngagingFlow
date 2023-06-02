import {DEFINITION} from '../engaging_flow/definition'

const breakPoint = 1 / 2;

function connectPath(params) {
    
    const fromItem = params.fromItem;
    addRightBottom(fromItem);

    const fromNode = params.fromNode;
    addRightBottom(fromNode);

    let toNode = params.toNode;
    if(toNode) addRightBottom(toNode);

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

        isFromNodePointer: params.isFromNodePointer,
        isTargetPointerEmpty: params.isTargetPointerEmpty,

        pathPoints: pathPoints,
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
        isTargetPointerEmpty: params.isTargetPointerEmpty,
    }));

    const pointers = [];
    searchPathParam.pointers = pointers;

    if(params.isFromNodePointer === true) {
        searchPathParam.axis = "x";
    } else {
        if(edge === 'right') searchPathParam.axis = "x";
            else searchPathParam.axis = "y";
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
    const toNode   = params.toNode;
    // const isFromNodePointer = params.isFromNodePointer;

    let toPointer = params.toPointer;

    const nodePointerSize = DEFINITION.NodePointerSize;
    const itemPointerSize = DEFINITION.ItemPointerSize;

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

    if(toPointer === undefined) {
        toPointer = {
            x: toNode.left - (nodePointerSize.width / 2) + DEFINITION.NODE_INPUT_POINTER_GAP_X,
            y: toNode.top + toNode.height / 2,
        }
    }

    // 아이템에서 fromPoint가 시작할 위치 판단
    if(
        itemRectFromContainer.top <= toPointer.y 
        && itemRectFromContainer.bottom >= toPointer.y
        && itemRectFromContainer.left <= toPointer.x
        && itemRectFromContainer.right >= toPointer.x
    ) {
        // Node의 input point가 fromItem의 내부에 있을 경우 그리지 않으므로
    } else {
        if (
            fromNode.top <= toPointer.y 
            && fromNode.bottom >= toPointer.y
            && fromNode.left <= toPointer.x
            && fromNode.right >= toPointer.x
        ) {
            
            if(
                ((itemRectFromContainer.right + itemPointerSize.width) < toPointer.x) ||
                params.isFromNodePointer === true
            ) {
                edgeResult.edge = 'right';
            } else {
                if(itemRectFromContainer.center.y < toPointer.y) {
                    edgeResult.edge = 'bottom';
                } else {
                    edgeResult.edge = 'top';
                }
            }
            
            edgeResult.isInsideTargetPointer = true;
        } else {
            if(itemRectFromContainer.right + itemPointerSize.width > toPointer.x) {
                if(
                    (fromNode.top <= toPointer.y 
                    && fromNode.bottom >= toPointer.y
                    && itemRectFromContainer.center.x < toPointer.x) ||
                    params.isFromNodePointer === true
                ) {
                    edgeResult.edge = 'right';
                } else {
                    if(itemRectFromContainer.center.y < toPointer.y) {
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
                // let fromPointX;
                // if(isFromNodePointer) fromPointX = itemRectFromContainer.right + nodePointerSize.width / 2;
                //     else fromPointX = itemRectFromContainer.right + itemPointerSize.width / 2;

                edgeResult.fromPoint = {
                    x: itemRectFromContainer.right,
                    y: itemRectFromContainer.center.y,
                }
                                
                break;
            }
        }

        edgeResult.toPoint = toPointer;
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

    const edge                 = searchPathParam.edge;
    const axis                 = searchPathParam.axis;
    const fromNode             = searchPathParam.fromNode;
    const fromPoint            = searchPathParam.fromPoint;
    const wayPoint             = searchPathParam.wayPoint;
    const toPoint              = searchPathParam.toPoint;
    const pointers             = searchPathParam.pointers;
    const isTargetPointerEmpty = searchPathParam.isTargetPointerEmpty;

    const itemPointerSize = DEFINITION.ItemPointerSize;
    const nodePointerSize = DEFINITION.NodePointerSize;

    if(pointers.length > DEFINITION.MAXIMUM_PATH_POINTER_COUNT) return;

    if(Math.round(wayPoint.x) !== Math.round(toPoint.x) || Math.round(wayPoint.y) !== Math.round(toPoint.y)) {

        let newPoint = {};

        if(axis === "x") {
            newPoint.y = wayPoint.y;
            const xDistance = toPoint.x - wayPoint.x;
            
            if(xDistance >= 0 || pointers.length === 0) {
                newPoint.direction = 'right';
            } else {
                newPoint.direction = 'left';
            }
            
            if(newPoint.direction === 'left') {                
                if(pointers.length !== 0) {
                    newPoint.x = wayPoint.x + xDistance - nodePointerSize.width;
                } else {
                    newPoint.x = wayPoint.x + nodePointerSize.width;
                }
            } else {
                if(Math.round(newPoint.y) === Math.round(toPoint.y)) {
                    newPoint.x = wayPoint.x + xDistance
                } else {
                    let breakDistance = xDistance * breakPoint;

                    if(isTargetPointerEmpty === true) {
                        if(breakDistance < nodePointerSize.width) breakDistance = nodePointerSize.width;
                    } else {
                        if(breakDistance < itemPointerSize.width) breakDistance = itemPointerSize.width;
                    }

                    newPoint.x = wayPoint.x + breakDistance;
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
            
            if(Math.round(newPoint.x) === Math.round(fromPoint.x)) { // x가 시작포인트와 동일하고
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
                if(newPoint.x < toPoint.x) {
                    newPoint.y = wayPoint.y + yDistance;
                } else {

                    // 도착 포인트가 시작포인트보다 -에 있을 경우 y 포인트가 충분히 이동하지 못해서
                    // 노드 안으로 침범하는것을 방지하기 위해서
                    newPoint.y = wayPoint.y + yDistance * breakPoint;
                    if(fromNode.top <= newPoint.y && newPoint.y <= fromNode.bottom) {
                        newPoint.y = wayPoint.y + yDistance;
                    }
                }
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
                        pushPointer.x = fromNode.right - DEFINITION.HIGHRIGHT_ITEM_BORDER_WIDTH;
                        pointers.push(pushPointer);
                            
                    } else {
                        pushPointer.x = fromNode.left;
                        pointers.push(pushPointer);
                    }
                    
                } else {
                    if(wayPoint.y > toPoint.y) {
                        pushPointer.y = fromNode.top + DEFINITION.HIGHRIGHT_ITEM_BORDER_WIDTH;
                        pointers.push(pushPointer);
                    } else {
                        pushPointer.y = fromNode.bottom - DEFINITION.HIGHRIGHT_ITEM_BORDER_WIDTH;
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