// import {DEFINITION} from './definition'
// import {getParentElement} from './flow_function'

/**
 * 
 * @param event 
 */    
function handleMouseEnterInput(event) {
    // TODO: handleMouseEnterInput
}



/**
 * 
 * @param event 
 */    
function handleMouseLeaveInput(event) {
    // TODO: handleMouseLeaveInput
}



/**
 * 
 * @param event 
 */    
function handleMouseDownOutput(event, flowData, containerPosition, flowSetFlowDragMode, setOutPointerDrag) {

    // TODO: Connection path 다시 만들기
    // const flowNode = getParentElement(event.target, 'flow-node');
    // if(!flowNode) return;

    // const nodeId = flowNode.getAttribute('id');
    // const fromNode = flowData.find((element) => { return(element.id === nodeId) });
    // if(!fromNode) return;
    
    // setOutPointerDrag({
    //     fromNode: fromNode,
    //     fromItem: {
    //         top: fromNode.height / 2 - DEFINITION.NodePointerSize.height / 2,
    //         left: fromNode.width - (DEFINITION.NodePointerSize.width),
    //         width: DEFINITION.NodePointerSize.width,
    //         height: DEFINITION.NodePointerSize.height,
    //     },
    //     isFromNodePointer: true,
    //     containerPosition: containerPosition,
    //     pathInfo: null,
    // });

    
    // flowSetFlowDragMode(DEFINITION.FlowActionMode.pointer);
}

export {
    handleMouseEnterInput, 
    handleMouseLeaveInput, 
    handleMouseDownOutput,
}