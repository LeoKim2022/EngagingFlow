export default function connectPath(params) {

    // fromItem 에서 path가 어느 edge에서 시작할지 판단한다.
    const fromItem = params.fromItem;
    addRightBottom(fromItem);

    const fromNode = params.fromNode;
    addRightBottom(fromNode);

    const targetNode = params.targetNode;
    addRightBottom(targetNode);

    const nearEdgeResult = findStartEdge(params);

    // const nearEdgeResult = nearEdge(fromNode, fromItem);    
    // console.log("🚀 ~ nearEdgeResult:", nearEdgeResult);
    
    // 경계선과 외곽선 사이에서 아이템이 없는 방향 우선
    // const targetEdge = checkObstacle(fromNode, fromItem, nearEdgeResult);
    // if(!targetEdge) return(null);






    // 가장 가까운 경계선부터 경계선과 노드 외곽선 사이에 아이템이 있는지 확인한다.

    // 아웃풋 경로 확정



    // 들어가야할 인풋 탐색




    // console.log("🚀 ~ targetEdge:", targetEdge);
    const svgFrom = nearEdgeResult.fromPoint;
    const svgTo   = nearEdgeResult.toPoint;

    return({
        edge: nearEdgeResult.edge,
        svgRect: {
            top: (svgFrom.y < svgTo.y)? svgFrom.y: svgTo.y,
            left: (svgFrom.x < svgTo.x)? svgFrom.x: svgTo.x,
            width: (svgFrom.x < svgTo.x)? (svgTo.x - svgFrom.x): (svgFrom.x - svgTo.x),
            height: (svgFrom.y < svgTo.y)? (svgTo.y - svgFrom.y): (svgFrom.y - svgTo.y),
        }
    });
    
}

function addRightBottom(rect) {
    rect.right  = rect.left + rect.width;
    rect.bottom = rect.top + rect.height;
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

    const itemCenter = {
        x: fromItem.left + (fromItem.width / 2) + fromNode.left,
        y: fromItem.top + (fromItem.height / 2) + fromNode.top,
    }

    const targetNodePointer = {
        x: targetNode.left - (nodePointerSize.width / 2) + nodeInputPointerGap,
        y: targetNode.top + (targetNode.height / 2),
    }

    if(
        fromItem.top <= targetNodePointer.y 
        && fromItem.bottom >= targetNodePointer.y
        && fromItem.left <= targetNodePointer.x
        && fromItem.right >= targetNodePointer.x
    ) {
        // Node의 input point가 fromItem의 내부에 있을 경우 그리지 않는다.
        return(edgeResult);
    } else {
        if (
            fromNode.top <= targetNodePointer.y 
            && fromNode.bottom >= targetNodePointer.y
            && fromNode.left <= targetNodePointer.x
            && fromNode.right >= targetNodePointer.x
        ) {
            // Node의 input point가 fromNode 내부에 있을 경우 노드의 앞뒤를 비교해야 한다.
        } else {
            if(fromItem.right + (itemPointerSize.width * 3) > targetNodePointer.x) {
                if(
                    fromNode.top <= targetNodePointer.y 
                    && fromNode.bottom >= targetNodePointer.y        
                ) {
                    // 오른쪽으로 뺀다.
                    edgeResult.edge = 'right';
                    edgeResult.fromPoint = {
                        x: fromItem.right + fromNode.left,
                        y: itemCenter.y,
                    }
                    edgeResult.toPoint = targetNodePointer;
                } else {
                    if(itemCenter.y > targetNodePointer.y) {
                        edgeResult.edge = 'bottom';
                        edgeResult.fromPoint = {
                            x: itemCenter.x,
                            y: fromItem.bottom,
                        }
                    } else {
                        edgeResult.edge = 'top';
                        edgeResult.fromPoint = {
                            x: itemCenter.x,
                            y: fromItem.top,
                        }
                    }
                }
            } else {
                // 오른쪽으로 뺀다.
                edgeResult.edge = 'right';
                edgeResult.fromPoint = {
                    x: fromItem.right + fromNode.left,
                    y: itemCenter.y,
                }
                edgeResult.toPoint = targetNodePointer;
            }

        }
    }

    return(edgeResult);
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
