import {DEFINITION} from '../definition'
import {findNodeElement, getItemRectFromFlow} from '../flow_function'



/**
 * Calculates and returns the rectangle of an element with position and dimensions.
 * @param element The element to calculate the rectangle for.
 * @param nodeData The data of all node elements.
 * @returns {(Object|null)} - The calculated rectangle for the element.
 */
function getElementRect(element, nodeData) {
    let elementRect = null;

    if(element.type === DEFINITION.ElementType.node) {
        const node = findNodeElement(element.id, DEFINITION.ElementType.node, nodeData);
        elementRect = {
            top : node.top, 
            left : node.left, 
            right : node.left + node.width, 
            bottom : node.top + node.height, 
        }
    } else if(element.type === DEFINITION.ElementType.item) {
        const itemRect = getItemRectFromFlow(element.id, nodeData);
        elementRect = {
            top : itemRect.top + DEFINITION.ITEM_BORDER_WIDTH, 
            left : itemRect.left + DEFINITION.ITEM_BORDER_WIDTH, 
            right : itemRect.right + DEFINITION.ITEM_BORDER_WIDTH * 2, 
            bottom : itemRect.bottom + DEFINITION.ITEM_BORDER_WIDTH * 2, 
        }
    }

    elementRect.width  = elementRect.right - elementRect.left;
    elementRect.height = elementRect.bottom - elementRect.top;

    return(elementRect);
}



/**
 * Calculates and returns the bounding rectangle and HTML elements for selected elements.
 * @param {Object} params - The parameters object.
 * @returns {Object} The bounding rectangle and HTML elements for selected elements
 */
function selectedItemRect(params) {

    const selectedElements = params.selectedElements;
    const nodeData = params.nodeData;

    let selectedRect = null;
    let selectedDivHtml = [];

    if(selectedElements.length) {

        const allFlowCoord = {
            top: [],
            left: [],
            right: [],
            bottom: [],
        }

        selectedElements.forEach((element) => {
    
            const elementRect = getElementRect(element, nodeData);
    
            allFlowCoord.top.push(elementRect.top);
            allFlowCoord.left.push(elementRect.left);
            allFlowCoord.right.push(elementRect.right);
            allFlowCoord.bottom.push(elementRect.bottom);
    
            selectedDivHtml.push(
                <div key={element.id} className='flow-selected-item' style={elementRect}/>
            );
    
        });

        selectedRect = {
            top : Math.min(...allFlowCoord.top),
            left : Math.min(...allFlowCoord.left),
            right : Math.max(...allFlowCoord.right),
            bottom : Math.max(...allFlowCoord.bottom),
        };

        selectedRect.width  = selectedRect.right - selectedRect.left;
        selectedRect.height = selectedRect.bottom - selectedRect.top;
    }
    
    return({
        selectedRect: selectedRect,
        selectedElementsRectHtml: selectedDivHtml,
    });
}

export {getElementRect, selectedItemRect}

