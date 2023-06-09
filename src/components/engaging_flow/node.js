import React, { useRef,  } from 'react';

import {DEFINITION} from './definition'
import {getParentElement} from './flow_function'

import NodeItem from './node_item/node_item'

// import {DEFINITION} from './definition'
import {isEmptyArray} from '../function/common'
import {nodePointerPentagon, nodePointerTriangle} from './node_pointer_polygon'
import {connectPath} from '../function/connect_path'

import {useFlowData} from '../context_flow_data'
import {useGlobalConfig} from '../context_global_config'


export default function Node(props) {
    const [flowData, ] = useFlowData();
    const [globalConfig, ] = useGlobalConfig();

    const svgPolygon = nodePointerPentagon();
    const node = props.node;

    let itemHtml
    let insideSvgHtml = [];

    if(!isEmptyArray(node.items)) {
        itemHtml = node.items.map((item, index) => {

            let pathInfo = null;

            item.right  = item.left + item.width;
            item.bottom = item.top + item.height;

            if(!item.id) return(null);

            if(item.action !== undefined) {
                const targetNode = flowData.find((element) => { return(element.id === item.action.id) });

                pathInfo = connectPath({
                    toNode: targetNode,
                    fromNode: node,
                    fromItem: item,
                    containerPosition: props.containerPosition,
                });

                const insideSvgItem = createInsideSvgItem(pathInfo, globalConfig);
                insideSvgHtml.push(...insideSvgItem);
            }

            return(
                <NodeItem 
                    key={index} 
                    item={item}
                    onUpdateHighlightItem={props.onUpdateHighlightItem}
                    onItemMouseDown={props.onItemMouseDown}
                />
            );
        })
    }

    const inputPointerLocation = useRef(null);
    const outputPointerLocation = useRef(null);

    return (
        <div 
            className='flow-node' 
            id={node.id}
            style={{
                top: node.top, 
                left: node.left,
                width: node.width, 
                height: node.height
            }}

            onMouseDown={(event) => {
                event.stopPropagation();
                props.onNodeMouseDown(event);
            }}

            onMouseUp={(event) => {
                props.onNodeMouseUp(event);
            }}

            onMouseOver={(event) => {

                let highlightTarget = null;
                if(event.target.classList.contains('flow-node')) {
                    highlightTarget = event.target;
                } else if(event.target.classList.contains('node-content')) {
                    const flowNode = getParentElement(event.target, 'flow-node');
                    highlightTarget = flowNode;
                }

                props.onUpdateHighlightNode(event, highlightTarget);
            }}

            onMouseOut={(event) => {

                let highlightTarget = null;
                if(event.target.classList.contains('flow-node')) {
                    highlightTarget = event.target;
                } else if(event.target.classList.contains('node-content')) {
                    const flowNode = getParentElement(event.target, 'flow-node');
                    highlightTarget = flowNode;
                }

                props.onUpdateHighlightNode(event, highlightTarget);
            }}
        >

            <div 
                className='node-content' 
                style={{
                    width: node.width - DEFINITION.CONTROL_RECT_BORDER_WIDTH * 2, 
                    height: node.height - DEFINITION.CONTROL_RECT_BORDER_WIDTH * 2
                }}
            >
                {itemHtml}
            </div>

            <div className='node-inside-svg'>
                <svg>
                    {insideSvgHtml}
                </svg>
            </div>

            <div className='node-pointer node-inputs'>
                <div 
                    className='node-input' 
                    ref={inputPointerLocation}

                    onMouseEnter={props.onInputPointerMouseEnter}
                    onMouseLeave={props.onInputPointerMouseLeave}

                    onMouseDown={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <svg width={DEFINITION.NodePointerSize.width} height={DEFINITION.NodePointerSize.height}>
                        <polygon points={svgPolygon} />
                    </svg>
                </div>
            </div>

            <div className='node-pointer node-outputs'>
                <div 
                    className='node-output' 
                    ref={outputPointerLocation}
                    onMouseDown={(event) => {
                        event.stopPropagation();
                        props.onOutputPointerMouseDown(event);
                    }}
                >
                    <svg width={DEFINITION.NodePointerSize.width} height={DEFINITION.NodePointerSize.height}>
                        <polygon points={svgPolygon} />
                    </svg>
                </div>
            </div>

        </div>
    )
}                        



/**
 * 
 */
function createInsideSvgItem(pathInfo, globalConfig) {

    if(!pathInfo || isEmptyArray(pathInfo.pathPoints)) return([]);

    const fromNode = pathInfo.fromNode;
    const fromPoint = pathInfo.fromPoint;
    // const itemPointerSize = pathInfo.itemPointerSize;
    
    let insidePoints  = [];
    let insideSvgItem = [];
    
    pathInfo.pathPoints.forEach((point) => {
        if(point.isInside === true) {
            insidePoints.push({
                direction: point.direction,
                x: point.x - fromNode.left,
                y: point.y - fromNode.top,
            })
        }
    });    

    const itemPoint = {
        x: fromPoint.x - fromNode.left,
        y: fromPoint.y - fromNode.top,
    }

    let pathVal;
    
    if(pathInfo.edge === 'top') {
        pathVal = `M${itemPoint.x} ${itemPoint.y}`;
    } else if(pathInfo.edge === 'bottom') {
        pathVal = `M${itemPoint.x} ${itemPoint.y}`;
    } else {
        pathVal = `M${itemPoint.x} ${itemPoint.y}`;
    }

    if(insidePoints.length) {        
        insidePoints.forEach((point, index) => {
            pathVal += ` L${point.x} ${point.y}`
        })
        
        insideSvgItem.push(<path 
            key={insideSvgItem.length} 
            d={pathVal} 
            stroke={globalConfig.lineColor} 
            opacity={globalConfig.opacity}
        />);
    }

    const trianglePoints = nodePointerTriangle(pathInfo.edge, itemPoint);
    insideSvgItem.push(<polygon key={insideSvgItem.length} points={trianglePoints} />);

    return(insideSvgItem);
}