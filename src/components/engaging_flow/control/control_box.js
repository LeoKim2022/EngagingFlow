import {DEFINITION} from '../definition'

import './control.css'

export default function ControlBox(props) {

    let controlRect = null;
    let highLightItem = null;

    if(props.flowDragMode === DEFINITION.FlowActionMode.rect && props.mouseClientY !== null && props.mouseClientX !== null) {
        
        const scaleValueOrigin = props.editorScaleLev / 10;
        const rectTop    = Math.min(props.targetDragInfo.clientY, props.mouseClientY);
        const rectLeft   = Math.min(props.targetDragInfo.clientX, props.mouseClientX);
        const rectRight  = Math.max(props.targetDragInfo.clientX, props.mouseClientX);
        const rectBottom = Math.max(props.targetDragInfo.clientY, props.mouseClientY);
    
        controlRect = {
            top: (rectTop - props.boxRect.top) / scaleValueOrigin - props.containerPosition.top,
            left: (rectLeft - props.boxRect.left) / scaleValueOrigin - props.containerPosition.left,
            width: (rectRight - rectLeft) / scaleValueOrigin,
            height: (rectBottom - rectTop) / scaleValueOrigin,
        }
        
    } else {
        if(props.highlightItem) {

            let targetItem = null;
            const targetNode = props.nodeData.find((node) => {
                if(Array.isArray(node.items)) {
                    targetItem = node.items.find((item) => {
                        return(item.id === props.highlightItem);
                    });

                    if(targetItem) return(true);
                        else return(false);
                }

                return(false);
            });
            
            if(targetNode && targetItem) {
                highLightItem = {                    
                    top   : targetNode.top + targetItem.top + 1,
                    left  : targetNode.left + targetItem.left + 1,
                    width : targetItem.width - DEFINITION.HIGHRIGHT_ITEM_BORDER_WIDTH,
                    height: targetItem.height - DEFINITION.HIGHRIGHT_ITEM_BORDER_WIDTH,
                }
            }

        } else if(props.highlightNode) {

            const targetNode = props.nodeData.find((node) => {                
                return(node.id === props.highlightNode);
            });
            
            if(targetNode) {
                highLightItem = {                    
                    top   : targetNode.top,
                    left  : targetNode.left,
                    width : targetNode.width - DEFINITION.HIGHRIGHT_ITEM_BORDER_WIDTH * 2,
                    height: targetNode.height - DEFINITION.HIGHRIGHT_ITEM_BORDER_WIDTH * 2,
                }
            }

        }        
    }

    return(
        <div 
            className="flow-control-box"
            style={{
                top: props.containerPosition.top, 
                left: props.containerPosition.left,
            }}
        >
            {
                (controlRect) ? <div 
                    className='flow-control-rect'
                    style={controlRect}
                /> : null
            }

            {
                (highLightItem) ? <div 
                    className='flow-highlight-item'
                    style={highLightItem}
                /> : null
            }

        </div>
    )
}