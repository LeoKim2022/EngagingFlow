import {DEFINITION} from '../definition'

import './control.css'

export default function ControlBox(props) {

    // console.log("🚀 ~ props.highlightNode:", props.highlightNode);
    // console.log("🚀 ~ props.highlightItem:", props.highlightItem);

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

        // TODO: *** 2023--6-01 *** Check selected item
    } else {

        
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