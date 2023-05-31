import {isEmptyArray} from '../function/common'

import {useGlobalConfig} from '../context_global_config'

export default function Connection(props) {

    const [globalConfig, ] = useGlobalConfig();

    if(!props.pathInfo || isEmptyArray(props.pathInfo.pathPoints)) return;

    const fromPath = props.pathInfo.pathPoints.findLast((pathItem) => {
        return(pathItem.isInside === true);
    });

    const pathInfo = props.pathInfo.pathPoints.filter((pathItem) => {
        return(pathItem.isInside !== true);
    });

    if(!fromPath || isEmptyArray(pathInfo)) return;
    
    let pathVal = `M${fromPath.x} ${fromPath.y}`;

    pathInfo.forEach((pathItem) => {
        pathVal += ` L${pathItem.x} ${pathItem.y}`;
    })

    return (
        <path 
            d={pathVal}
            stroke={globalConfig.lineColor}
            opacity={globalConfig.opacity}
            fill="none"
        />
    )
}