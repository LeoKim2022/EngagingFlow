import {DEFINITION} from './definition'

/**
 * 
 * @param event 
 */    
function handleMouseEnterInput(event) {
    console.log("🚀 ~ handleMouseEnterInput:", );
}



/**
 * 
 * @param event 
 */    
function handleMouseLeaveInput(event) {
    console.log("🚀 ~ handleMouseLeaveInput:", );
}



/**
 * 
 * @param event 
 */    
function handleMouseDownOutput(event, flowSetFlowDragMode) {
    flowSetFlowDragMode(DEFINITION.FlowActionMode.pointer);
}

export {
    handleMouseEnterInput, 
    handleMouseLeaveInput, 
    handleMouseDownOutput
}