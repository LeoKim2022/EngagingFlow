function connectPath(params) {

    // fromItem 에서 path가 어느 edge에서 시작할지 판단한다.
    const fromItem = params.fromItem;
    addRightBottom(fromItem);

    const fromNode = params.fromNode;
    addRightBottom(fromNode);

    const targetNode = params.targetNode;
    addRightBottom(targetNode);

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
        targetNode: targetNode,

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

    const nodePointerSize = params.nodePointerSize;
    const fromNode = params.fromNode;
    // const fromItem = params.fromItem;

    const edge = nearEdgeResult.edge;
    const fromPoint = nearEdgeResult.fromPoint;
    const toPoint = nearEdgeResult.toPoint;
    const isInsideTargetPointer = nearEdgeResult.isInsideTargetPointer;

    const landscapeLength = toPoint.x - fromPoint.x;
    // const verticalLength  = toPoint.y - fromPoint.y;

    const pointers = [];
    const breakPoint = 0.85;

    switch(edge) {
        case 'top': {
            break;
        }

        case 'bottom': {
            searchPath("y", fromNode, fromPoint, toPoint, pointers);
            break;
        }
    
        default: {

            // Line이 오른쪽에서 시작하는 경우 최소 공간이 확보된 상황에서만 발생한다. 반드시 수평선으로 시작한다.
            if(isInsideTargetPointer) {
                pointers.push({
                    x: fromPoint.x + (landscapeLength * breakPoint),
                    y: fromPoint.y
                })
    
                pointers.push({
                    x: fromPoint.x + (landscapeLength * breakPoint),
                    y: toPoint.y
                })
            } else {
                let newPoint = {
                    x: fromPoint.x + (landscapeLength * breakPoint),
                    y: fromPoint.y
                }

                let isAlreadyOut = false;

                if(isOutPoint(newPoint, fromNode)) {
                    // Node와 path avg의 z-order 문제로 인하여 Node안의 path와 바깥의 path를 별도로 그려야 한다.
                    pointers.push({
                        isInside: true,
                        x: fromNode.right,
                        y: fromPoint.y,
                    });

                    pointers.push({
                        x: fromPoint.x + (landscapeLength * breakPoint),
                        y: fromPoint.y,
                    });

                    isAlreadyOut = true;
                } else {
                    pointers.push({
                        isInside: true,
                        x: newPoint.x,
                        y: newPoint.y,
                    });
                }

                newPoint = {
                    x: fromPoint.x + (landscapeLength * breakPoint),
                    y: toPoint.y
                }

                if(isOutPoint(newPoint, fromNode) && !isAlreadyOut) {
                    let edgeY; 
                    if(fromPoint.y > toPoint.y) {
                        edgeY = fromNode.top;
                    } else {
                        edgeY = fromNode.bottom;
                    }

                    pointers.push({
                        isInside: true,
                        x: fromPoint.x + (landscapeLength * breakPoint),
                        y: edgeY,
                    });

                    pointers.push({
                        x: fromPoint.x + (landscapeLength * breakPoint),
                        y: toPoint.y,
                    });
                } else {
                    pointers.push({
                        x: newPoint.x,
                        y: newPoint.y,
                    });
                }
            }

            break;
        }
    }

    console.log("🚀 ~ pointers:", pointers);
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
                if(Array.isArray(fromNode.items) && fromNode.items.length > 0) {
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
                if(Array.isArray(fromNode.items) && fromNode.items.length > 0) {
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
                if(Array.isArray(fromNode.items) && fromNode.items.length > 0) {
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
        if(Array.isArray(nearEdgeResult) && nearEdgeResult.length > 0) {
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

    const nodeInputPointerGap = 3;

    const fromItem = params.fromItem;
    const fromNode = params.fromNode;
    const targetNode = params.targetNode;

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

    const targetNodePointer = {
        x: targetNode.left - (nodePointerSize.width / 2) + nodeInputPointerGap,
        y: targetNode.top + (targetNode.height / 2),
    }

    if(
        itemRectFromContainer.top <= targetNodePointer.y 
        && itemRectFromContainer.bottom >= targetNodePointer.y
        && itemRectFromContainer.left <= targetNodePointer.x
        && itemRectFromContainer.right >= targetNodePointer.x
    ) {
        // Node의 input point가 fromItem의 내부에 있을 경우 그리지 않는다.
    } else {
        if (
            fromNode.top <= targetNodePointer.y 
            && fromNode.bottom >= targetNodePointer.y
            && fromNode.left <= targetNodePointer.x
            && fromNode.right >= targetNodePointer.x
        ) {
            
            if((itemRectFromContainer.right + itemPointerSize.width) < targetNodePointer.x) {
                edgeResult.edge = 'right';
            } else {
                if(itemRectFromContainer.center.y < targetNodePointer.y) {
                    edgeResult.edge = 'bottom';
                } else {
                    edgeResult.edge = 'top';
                }
            }
            
            edgeResult.isInsideTargetPointer = true;
        } else {
            if(itemRectFromContainer.right + (itemPointerSize.width * 3) > targetNodePointer.x) {
                if(
                    fromNode.top <= targetNodePointer.y 
                    && fromNode.bottom >= targetNodePointer.y
                    && itemRectFromContainer.center.x < targetNodePointer.x
                ) {
                    edgeResult.edge = 'right';
                } else {
                    if(itemRectFromContainer.center.y < targetNodePointer.y) {
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
                    x: itemRectFromContainer.right,
                    y: itemRectFromContainer.center.y,
                }
                break;
            }
        }

        edgeResult.toPoint = targetNodePointer;
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
        fromNode.top < firstPoint.y
        && fromNode.bottom > firstPoint.y
        && fromNode.left < firstPoint.x
        && fromNode.right > firstPoint.x
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



function searchPath(axis, fromNode, newPoint, toPoint, pointers) {
    if(newPoint.x === toPoint.x && newPoint.y === toPoint.y) {
        return(pointers);
    } else {

        // TODO: searchPath
        // searchPath((axis === "x") ? "y" : "x", fromNode, {}, toPoint, pointers);
    }
}

export {connectPath, isOutPoint}