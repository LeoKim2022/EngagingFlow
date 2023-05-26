const DEFINITION = Object.freeze({

    NODE_INPUT_POINTER_GAP_X : 3,
    ITEM_POINTER_GAP_X : 1 / 2,
    
    FLOW_SCALE_MIN : 7,
    FLOW_SCALE_MAX : 50,
    FLOW_SCALE_STEP : 1,
    FLOW_SCALE_LEVEL_RATE : 10,

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
    
    ScrollBarType : Object.freeze({
        horizontal: 100,
        vertical:   200,
    }),
    
    KeyCode : Object.freeze({
        space: 32,
        esc:   27,
        s:     83,
        x:     88,
        c:     67,
        v:     86,
        z:     90,
        y:     89,
    }),

});

export {DEFINITION}