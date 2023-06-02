import { createContext, useContext, useReducer } from 'react';

const ContextControlRect = createContext();

/**
 * 
 * @param {*} state  
 * @param {*} action 
 */
function controlRectReducer(state, action) {

    // TODO: ...
}



function ControlRectProvider({children}) {
    const [controlRect, setControlRect] = useReducer(controlRectReducer, {});

    return(
        <ContextControlRect.Provider value={[controlRect, setControlRect]}>
            {children}
        </ContextControlRect.Provider>
    )
}

function useControlRect() {
    return(useContext(ContextControlRect));
}

export {ControlRectProvider, useControlRect}