import {DEFINITION} from '../definition'

export default function ControlRect(props) {

    const rectResult = props.rectResult;
    const controlRectStyle = {};

    switch(props.className) {
        case 'top': {
            controlRectStyle.top    = rectResult.selectedRect.top - DEFINITION.CONTROL_RECT_BORDER_MARGIN;
            controlRectStyle.left   = rectResult.selectedRect.left - DEFINITION.CONTROL_RECT_BORDER_MARGIN;
            controlRectStyle.width  = rectResult.selectedRect.width;
            controlRectStyle.height = DEFINITION.CONTROL_RECT_BORDER_WIDTH;
            break;
        }
    
        case 'left': {
            controlRectStyle.top    = rectResult.selectedRect.top - DEFINITION.CONTROL_RECT_BORDER_MARGIN;
            controlRectStyle.left   = rectResult.selectedRect.left - DEFINITION.CONTROL_RECT_BORDER_MARGIN;
            controlRectStyle.width  = DEFINITION.CONTROL_RECT_BORDER_WIDTH;
            controlRectStyle.height = rectResult.selectedRect.height;
            break;
        }
    
        case 'right': {
            controlRectStyle.top    = rectResult.selectedRect.top - DEFINITION.CONTROL_RECT_BORDER_MARGIN;
            controlRectStyle.left   = rectResult.selectedRect.right - DEFINITION.CONTROL_RECT_BORDER_WIDTH - DEFINITION.CONTROL_RECT_BORDER_MARGIN;
            controlRectStyle.width  = DEFINITION.CONTROL_RECT_BORDER_WIDTH;
            controlRectStyle.height = rectResult.selectedRect.height;
            break;
        }
    
        case 'bottom': {
            controlRectStyle.top    = rectResult.selectedRect.bottom - DEFINITION.CONTROL_RECT_BORDER_WIDTH - DEFINITION.CONTROL_RECT_BORDER_MARGIN;
            controlRectStyle.left   = rectResult.selectedRect.left - DEFINITION.CONTROL_RECT_BORDER_MARGIN;
            controlRectStyle.width  = rectResult.selectedRect.width;
            controlRectStyle.height = DEFINITION.CONTROL_RECT_BORDER_WIDTH;
            break;
        }
    
        default: {
            break;
        }
    }

    controlRectStyle.padding = DEFINITION.CONTROL_RECT_BORDER_MARGIN;

    let resizableClass = '';
    if(props.resize !== DEFINITION.ElementType.item) {
        if(props.className === 'right' || props.className === 'left')
        resizableClass = 'no-resize';
    }

    return(
        <div
            className={`flow-control-rect ${props.className} ${resizableClass}`}
            
            style={{
                top: controlRectStyle.top,
                left: controlRectStyle.left,
                padding: controlRectStyle.padding,
            }}

            onMouseDown={(event) => {

                event.preventDefault();
                event.stopPropagation();

                if(event.target.classList.contains('no-resize')) return;

                if(event.target.classList.contains('top')) {
                    props.updateFlowDragMode(event, DEFINITION.FlowActionMode.resizeTop);
                } else if(event.target.classList.contains('bottom')) {
                    props.updateFlowDragMode(event, DEFINITION.FlowActionMode.resizeBottom);
                } else if(event.target.classList.contains('right')) {
                    props.updateFlowDragMode(event, DEFINITION.FlowActionMode.resizeRight);
                } else {
                    props.updateFlowDragMode(event, DEFINITION.FlowActionMode.resizeLeft);
                }
            }}
        >
            <div
                style={{
                    width: controlRectStyle.width,
                    height: controlRectStyle.height,
                }}
            />
        </div>
    )
}
