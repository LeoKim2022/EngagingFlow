import { createContext, useContext, useReducer } from 'react';

const ContextFlowData = createContext();

/**
 * 
 * @param {*} state  
 * @param {*} action 
 */
function flowDataReducer(state, action) {
    if(JSON.stringify(state) === JSON.stringify(action.value)) return(state);
        else return(action.value);
}



function FlowDataProvider({children}) {
    const [flowData, setFlowData] = useReducer(flowDataReducer, []);

    return(
        <ContextFlowData.Provider value={[flowData, setFlowData]}>
            {children}
        </ContextFlowData.Provider>
    )
}

function useFlowData() {
    return(useContext(ContextFlowData));
}

export {FlowDataProvider, useFlowData}