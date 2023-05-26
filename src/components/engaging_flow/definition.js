const DEFINITION = Object.freeze({

    NODE_INPUT_POINTER_GAP_X : 3,
    ITEM_POINTER_GAP_X : 0.5,
    
    FLOW_SCALE_MIN : 7,
    FLOW_SCALE_MAX : 50,
    FLOW_SCALE_STEP : 1,

    FLOW_GRID_SIZE : 40,
    
    FlowActionMode : Object.freeze({
        none:    0,
        flow:    100,
        node:    200,
        pointer: 300,
    }),
    
    NodePointerSize : Object.freeze({
        width:  16,
        height: 14,
    }),
    
    ItemPointerSize : Object.freeze({
        width:  9,
        height: 7,
    }),
    
    MouseButtons : Object.freeze({
        left:  1,
        right: 2,
        wheel: 4,
        
    }),
});

export {DEFINITION}