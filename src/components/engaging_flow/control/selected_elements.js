import {DEFINITION} from '../definition'
import {findNodeElement, getItemRectFromFlow} from '../flow_function'

import ControlRect from './control_rect'

export default function SelectedElements(props) {

    let selectedElementStyle = null;
    let selectedDivHtml = [];
    let controlRectHtml = [];

    if(props.selectedElements.length) {

        const allFlowCoord = {
            top: [],
            left: [],
            right: [],
            bottom: [],
        }

        props.selectedElements.forEach((element) => {

            let elementRect = null;
            
            if(element.type === DEFINITION.ElementType.node) {
                const node = findNodeElement(element.id, DEFINITION.ElementType.node, props.nodeData);
                elementRect = {
                    top : node.top, 
                    left : node.left, 
                    right : node.left + node.width, 
                    bottom : node.top + node.height, 
                }
            } else if(element.type === DEFINITION.ElementType.item) {
                const itemRect = getItemRectFromFlow(element.id, props.nodeData);
                elementRect = {
                    top : itemRect.top + DEFINITION.ITEM_BORDER_WIDTH, 
                    left : itemRect.left + DEFINITION.ITEM_BORDER_WIDTH, 
                    right : itemRect.right + DEFINITION.ITEM_BORDER_WIDTH * 2, 
                    bottom : itemRect.bottom + DEFINITION.ITEM_BORDER_WIDTH * 2, 
                }
            }

            elementRect.width  = elementRect.right - elementRect.left;
            elementRect.height = elementRect.bottom - elementRect.top;

            allFlowCoord.top.push(elementRect.top);
            allFlowCoord.left.push(elementRect.left);
            allFlowCoord.right.push(elementRect.right);
            allFlowCoord.bottom.push(elementRect.bottom);
        
            selectedDivHtml.push(
                <div key={element.id} className='flow-selected-item' style={elementRect}/>
            );

        });

        selectedElementStyle = {
            top : Math.min(...allFlowCoord.top),
            left : Math.min(...allFlowCoord.left),
            right : Math.max(...allFlowCoord.right),
            bottom : Math.max(...allFlowCoord.bottom),
        };

        selectedElementStyle.width  = selectedElementStyle.right - selectedElementStyle.left;
        selectedElementStyle.height = selectedElementStyle.bottom - selectedElementStyle.top;

        controlRectHtml.push(
            <ControlRect
                key={'top'}
                style={{
                    top: selectedElementStyle.top - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    left: selectedElementStyle.left - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    width: selectedElementStyle.width,
                    height: DEFINITION.CONTROL_RECT_BORDER_WIDTH,
                }}
                className={'top'}
            />
        );

        controlRectHtml.push(
            <ControlRect
                key={'left'}
                style={{
                    top: selectedElementStyle.top - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    left: selectedElementStyle.left - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    width: DEFINITION.CONTROL_RECT_BORDER_WIDTH,
                    height: selectedElementStyle.height,
                }}
                className={'left'}
            />
        );

        controlRectHtml.push(
            <ControlRect
                key={'right'}
                style={{
                    top: selectedElementStyle.top - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    left: selectedElementStyle.right - DEFINITION.CONTROL_RECT_BORDER_WIDTH - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    width: DEFINITION.CONTROL_RECT_BORDER_WIDTH,
                    height: selectedElementStyle.height,
                }}
                className={'right'}
            />
        );

        controlRectHtml.push(
            <ControlRect
                key={'bottom'}
                style={{
                    top: selectedElementStyle.bottom - DEFINITION.CONTROL_RECT_BORDER_WIDTH - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    left: selectedElementStyle.left - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    width: selectedElementStyle.width,
                    height: DEFINITION.CONTROL_RECT_BORDER_WIDTH,
                }}
                className={'bottom'}
            />
        );

    }  

    return(<div>
        {controlRectHtml}
        {selectedDivHtml}
        {}
    </div>);
}