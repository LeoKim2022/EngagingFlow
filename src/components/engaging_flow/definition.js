const DEFINITION = Object.freeze({
    NODE_INPUT_POINTER_GAP_X : 3,
    ITEM_POINTER_GAP_X : 1 / 2,
    
    FLOW_EDITOR_ID : 'engaging_editor',

    FLOW_SCALE_MIN : 7,
    FLOW_SCALE_MAX : 50,
    FLOW_SCALE_STEP : 1,
    FLOW_SCALE_LEVEL_RATE : 10,

    FLOW_GRID_SIZE : 40,
    NODE_ELEMENT_GRID_SIZE : 10,

    CONTROL_RECT_BORDER_WIDTH : 2,
    CONTROL_RECT_BORDER_MARGIN: 4,

    NODE_BORDER_WIDTH: 2,
    ITEM_BORDER_WIDTH: 1,

    // 현재 구조상 이론적으로 7번을 넘을수가 없다.
    MAXIMUM_PATH_POINTER_COUNT: 7,

    DEFAULT_FONT_SIZE: 16,
    
    FlowActionMode : Object.freeze({
        none:      0,
        flow:      100,
        selected:  200,
        pointer:   300,
        rect:      400,
        resizeEw:  500,
        resizeNs:  600,
        resizeAll: 700,
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
    
    ElementType : Object.freeze({
        node : 100,
        item : 200,
    }),
    
    NodeItemType : Object.freeze({
        text   : 100,
        image  : 200,
        rect   : 300,
        button : 400,
        input  : 500,
        group  : 999,
    }),
    
    KeyCode : Object.freeze({
        space: 32,
        esc:   27,
        shift: 16,
        s:     83,
        x:     88,
        c:     67,
        v:     86,
        z:     90,
        y:     89,
    }),

});

export {DEFINITION}