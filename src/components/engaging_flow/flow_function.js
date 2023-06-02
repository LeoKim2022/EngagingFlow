import {DEFINITION} from './definition'
import {isEmptyArray} from '../function/common'

/**
 * This function converts the client coordinates (such as the position of the cursor) into a flow-relative coordinate system. 
 * @param {number} editorScale - The scale of the editor.
 * @param {Object} boxRect - An object representing the box rectangle dimensions {left, top}.
 * @param {Object} containerPosition - An object representing the container x and y positions {left, top}.
 * @param {Object} clientCoord - An object representing the client x and y coordinates {x, y}.
 * @returns {Object} - An object representing the transformed x and y coordinates {x, y}.
 */
function convertClientCoordToFlow(editorScale, boxRect, containerPosition, clientCoord) {
    const scaleOrigin = editorScale / DEFINITION.FLOW_SCALE_LEVEL_RATE;

    const newX = (clientCoord.x - boxRect.left - 1) / scaleOrigin - containerPosition.left;
    const newY = (clientCoord.y - boxRect.top - 1 ) / scaleOrigin - containerPosition.top;

    return({
        x: newX,
        y: newY
    });
}



/**
 * Finds a node element or an item element within a flow data set.
 *
 * @param {string} elementId - The ID of the element to be searched for.
 * @param {number} elementType - The type of the element, either "node" or "item".
 * @param {Array} flowData - The flow data set in which to search for the element.
 * @returns {(Object|null)} - The found element object if it exists, or null if not found.
 */
function findNodeElement(elementId, elementType, flowData) {
    if(isEmptyArray(flowData)) return(null);

    if(elementType === DEFINITION.ElementType.node) {

        const findItem = flowData.find((element) => {
            return(element.id ===  elementId);
        })

        return(findItem);

    } else if(elementType === DEFINITION.ElementType.item) {

        let findItem = null;
        let isFind = false;

        for(let index = 0, limit = flowData.length; index < limit; ++index) {
            const node = flowData[index];
            if(!isEmptyArray(node.items)) {
                for (let itemIndex = 0, itemLimit = node.items.length; itemIndex < itemLimit; ++itemIndex) {
                    const item = node.items[itemIndex];
                    if(item.id === elementId) {
                        isFind = true;
                        findItem = JSON.parse(JSON.stringify(item));
                        break;
                    }
                }
            }
    
            if(isFind) break;
        }

        return(findItem);
    } else {
        return(null);
    }

}



/**
 * Finds the rectangle boundaries of an item in a flow data set.
 *
 * @param {string} itemId - The ID of the item to be searched for.
 * @param {Array} flowData - The flow data set in which to search for the item.
 * @returns {(Object|null)} - The rectangle boundaries of the found item, or null if not found.
 */
function getItemRectFromFlow(itemId, flowData) {

    let targetItem = null;

    const targetNode = flowData.find((node) => {
        if(Array.isArray(node.items)) {
            targetItem = node.items.find((item) => {
                return(item.id === itemId);
            });

            if(targetItem) return(true);
                else return(false);
        }

        return(false);
    });

    if(targetNode && targetItem) {
        return({
            top: targetNode.top + targetItem.top,
            left: targetNode.left + targetItem.left,
            right: targetNode.left + targetItem.left + targetItem.width,
            bottom: targetNode.top + targetItem.top + targetItem.height,
        })
    } else {
        return(null);
    }

}



/**
 * Calculate the grid position based on the given editor scale, container position and parent size with gap.
 * 
 * @param {number} editorScale - The current editor scale level.
 * @param {Object} containerPosition - The current position of the container (top, left).
 * @param {Object} parentSizeWithGap - The parent size including gap (height, width).
 * @returns {Object} The calculated grid position (top, left).
 */
function getGridPosition(editorScale, containerPosition, parentSizeWithGap) {
    const editorScaleOrigin = editorScale / DEFINITION.FLOW_SCALE_LEVEL_RATE;

    // FLOW_GRID_SIZE 단위에서 flow container가 이동한 만큼 gird도 움직여야 하며, 그 거리는 scale 배율에 비례합니다.
    let gridTop = (DEFINITION.FLOW_GRID_SIZE - (containerPosition.top % DEFINITION.FLOW_GRID_SIZE)) * editorScaleOrigin * -1;

    // 양옆으로 항상 드래그가 가능한 영역이 추가로 있어야 합니다.
    gridTop += (parentSizeWithGap.height * editorScaleOrigin * -1 - editorScaleOrigin);

    let gridLeft = (DEFINITION.FLOW_GRID_SIZE - (containerPosition.left % DEFINITION.FLOW_GRID_SIZE)) * editorScaleOrigin * -1;
    gridLeft += (parentSizeWithGap.width * editorScaleOrigin * -1 - editorScaleOrigin);

    return({
        top : gridTop,
        left: gridLeft,
    })
}



/**
 * Finds the first ancestor element with the specified class name.
 *
 * @param {HTMLElement} element - The starting element for the search.
 * @param {string} className - The class name to look for in the element's ancestors.
 * @returns {HTMLElement|null} - Returns the first ancestor element with the specified class name, or null if none is found.
 */
function getParentElement(element, className) {
    let parent = element.parentNode;
  
    while (parent) {
        if (parent.classList !== undefined && parent.classList.contains(className)) {
            return parent;
        }
        parent = parent.parentNode;
    }
  
    return null;
}

export {
    convertClientCoordToFlow, 
    findNodeElement, 
    getItemRectFromFlow, 
    getGridPosition, 
    getParentElement
}