import {DEFINITION} from '../definition'

export default function ResizePoint(props) {

    const rectResult = props.rectResult;
    const resizePointStyle = {
        width: DEFINITION.CONTROL_RECT_RESIZE_POINTER_SIZE,
        height: DEFINITION.CONTROL_RECT_RESIZE_POINTER_SIZE,
    };

    const borderRectSizeHalf = (DEFINITION.CONTROL_RECT_BORDER_WIDTH + DEFINITION.CONTROL_RECT_RESIZE_POINTER_SIZE) / 2;
    const rectSizeHalf = DEFINITION.CONTROL_RECT_RESIZE_POINTER_SIZE / 2;

    switch(props.className) {
        case 'se': {
            resizePointStyle.top  = rectResult.selectedRect.bottom - borderRectSizeHalf;
            resizePointStyle.left = rectResult.selectedRect.right - borderRectSizeHalf;
            break;
        }
    
        case 'sw': {
            resizePointStyle.top  = rectResult.selectedRect.bottom - borderRectSizeHalf;
            resizePointStyle.left = rectResult.selectedRect.left - rectSizeHalf;
            break;
        }
    
        case 'ne': {
            resizePointStyle.top  = rectResult.selectedRect.top - rectSizeHalf;
            resizePointStyle.left = rectResult.selectedRect.right - borderRectSizeHalf;
            break;
        }
    
        case 'nw': {
            resizePointStyle.top  = rectResult.selectedRect.top - rectSizeHalf;
            resizePointStyle.left = rectResult.selectedRect.left - rectSizeHalf;
            break;
        }
    
        default: {
            break;
        }
    }

    resizePointStyle.padding = DEFINITION.CONTROL_RECT_BORDER_MARGIN;

    return(
        <div
            className={`rs-point rs-${props.className}`}
            
            style={resizePointStyle}

            onMouseDown={(event) => {

                event.preventDefault();
                event.stopPropagation();

                if(event.target.classList.contains('rs-nw')) {
                    props.updateFlowDragMode(event, DEFINITION.FlowActionMode.resizeTopLeft);
                } else if(event.target.classList.contains('rs-ne')) {
                    props.updateFlowDragMode(event, DEFINITION.FlowActionMode.resizeTopRight);
                } else if(event.target.classList.contains('rs-sw')) {
                    props.updateFlowDragMode(event, DEFINITION.FlowActionMode.resizeBottomLeft);
                } else {
                    props.updateFlowDragMode(event, DEFINITION.FlowActionMode.resizeBottomRight);
                }
            }}
        >
            
        </div>
    )
}
