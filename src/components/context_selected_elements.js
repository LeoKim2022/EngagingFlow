import { createContext, useContext, useReducer } from 'react';

const ContextSelectedElements = createContext();

/**
 * 
 * @param {*} state  
 * @param {*} action 
 */
function selectedElementsReducer(state, action) {

    // action에 있는 값만 비교한다. 항상 전부를 설정할 필요는 없다.
    if(typeof action !== 'object' || Object.keys(action).length < 1 ) return(state);

    const copyState = JSON.parse(JSON.stringify(state));
    const actionKeys = Object.keys(action);

    let hasDifferent = false;
    for(let index = 0, limit = actionKeys.length; index < limit; ++index) {        
        const key = actionKeys[index];
        if(state[key] !== action[key]) {
            hasDifferent = true;
            break;
        }
    }

    if(hasDifferent) {
        Object.assign(copyState, action);
        return(copyState);
    } else {
        return(state);
    }
}



function SelectedElementsProvider({children}) {
    const [selectedElements, setSelectedElements] = useReducer(selectedElementsReducer, {});

    return(
        <ContextSelectedElements.Provider value={[selectedElements, setSelectedElements]}>
            {children}
        </ContextSelectedElements.Provider>
    )
}

function useSelectedElements() {
    return(useContext(ContextSelectedElements));
}

export {SelectedElementsProvider, useSelectedElements}