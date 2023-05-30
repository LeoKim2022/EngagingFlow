import React, { useRef,  } from 'react';

import ItemPanel from './item_panel'

// import {DEFINITION} from './definition'
import {isEmptyArray} from '../function/common'
import {nodePointerPentagon, nodePointerTriangle} from '../function/node_pointer_polygon'
import {connectPath} from '../function/connect_path'

export default function Node(props) {

    const svgPolygon = nodePointerPentagon(props.nodePointerSize);
    const childData = props.childData;
    const node = props.node;

    let itemHtml
    let insideSvgHtml = [];

    if(!isEmptyArray(node.items)) {
        itemHtml = node.items.map((item, index) => {

            let pathInfo = null;
            if(item.action !== undefined) {
                const targetNode = childData.find((element) => { return(element.id === item.action.id) });

                pathInfo = connectPath({
                    toNode: targetNode,
                    fromNode: node,
                    fromItem: item,
                    containerPosition: props.containerPosition,
                    nodePointerSize: props.nodePointerSize,
                    itemPointerSize: props.itemPointerSize,
                });

                const insideSvgItem = createInsideSvgItem(pathInfo);
                insideSvgHtml.push(...insideSvgItem);
            }

            return(
                <ItemPanel 
                    key={index} 
                    item={item}
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
                left: node.left
            }}
            onMouseDown={(event) => {
                event.stopPropagation();
                props.onMouseDown(event);
            }}
        >
            <div className='node-inside-svg'>
                <svg>
                    {insideSvgHtml}
                </svg>
            </div>

            <div 
                className='node-content' 
                style={{
                    width: node.width, 
                    height: node.height
                }}
            >
                {itemHtml}
            </div>


            <div className='node-pointer node-inputs'>
                <div 
                    className='node-input' 
                    ref={inputPointerLocation}
                >
                    <svg width={props.nodePointerSize.width} height={props.nodePointerSize.height}>
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
                        // TODO: 아웃풋 포인터에서 마우스 다운이 발생하면 노드를 그리는 화면으로 안내가 되어야 함.
                    }}
                >
                    <svg width={props.nodePointerSize.width} height={props.nodePointerSize.height}>
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
function createInsideSvgItem(pathInfo) {
    if(!pathInfo || isEmptyArray(pathInfo.pathPoints)) return([]);

    const fromNode = pathInfo.fromNode;
    const fromPoint = pathInfo.fromPoint;
    const itemPointerSize = pathInfo.itemPointerSize;    
    
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
        pathVal = `M${itemPoint.x} ${itemPoint.y - 1}`;
    } else if(pathInfo.edge === 'bottom') {
        pathVal = `M${itemPoint.x} ${itemPoint.y + 1}`;
    } else {
        pathVal = `M${itemPoint.x + 1} ${itemPoint.y}`;
    }

    if(insidePoints.length) {        
        insidePoints.forEach((point, index) => {
            pathVal += ` L${point.x} ${point.y}`
        })
        
        insideSvgItem.push(<path key={insideSvgItem.length} d={pathVal} stroke="green"/>);
    }

    const trianglePoints = nodePointerTriangle(pathInfo.edge, itemPoint, itemPointerSize);
    insideSvgItem.push(<polygon key={insideSvgItem.length} points={trianglePoints} />);

    return(insideSvgItem);
}