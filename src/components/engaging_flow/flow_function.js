import {DEFINITION} from './definition'

/**
 * Finds the first ancestor element with the specified class name.
 *
 * @param {HTMLElement} element - The starting element for the search.
 * @param {string} className - The class name to look for in the element's ancestors.
 * @returns {?HTMLElement} - Returns the first ancestor element with the specified class name, or null if none is found.
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

export {getParentElement, getGridPosition}