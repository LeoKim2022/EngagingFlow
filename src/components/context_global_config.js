import { createContext, useContext, useReducer } from 'react';

const ContextGlobalConfig = createContext();

/**
 * 
 * @param {*} state  
 * @param {*} action 
 */
function globalConfigReducer(state, action) {

    // action에 있는 값만 비교한다. 항상 전부를 설정할 필요는 없다.
    if(typeof action.value !== 'object' || Object.keys(action.value).length < 1 ) return(state);

    const copyState = JSON.parse(JSON.stringify(state));
    const actionKeys = Object.keys(action.value);

    let hasDifferent = false;
    for(let index = 0, limit = actionKeys.length; index < limit; ++index) {        
        const key = actionKeys[index];
        if(state[key] !== action.value[key]) {
            hasDifferent = true;
            break;
        }
    }

    if(hasDifferent) {
        Object.assign(copyState, action.value);
        return(copyState);
    } else {
        return(state);
    }
}



function GlobalConfigProvider({children}) {
    const [globalConfig, setGlobalConfig] = useReducer(globalConfigReducer, {
        lineColor: '#0000FF',
        opacity: '0.5'
    });

    return(
        <ContextGlobalConfig.Provider value={[globalConfig, setGlobalConfig]}>
            {children}
        </ContextGlobalConfig.Provider>
    )
}

function useGlobalConfig() {
    return(useContext(ContextGlobalConfig));
}

export {GlobalConfigProvider, useGlobalConfig}