import React, { useRef,  } from 'react';

import ItemPanel from './item_panel'

import {nodePointerPentagon} from '../function/node_pointer_polygon'
import connectPath from '../function/connect_path'

export default function Node(props) {

    const svgPolygon = nodePointerPentagon(props.nodePointerSize);
    const childData = props.childData;
    const node = props.node;

    let itemHtml
    if(Array.isArray(node.items) && node.items.length > 0) {
        itemHtml = node.items.map((item, index) => {

            let pathPointer = null;
            if(item.action !== undefined) {
                const targetNode = childData.find((element) => { return(element.id === item.action.id) });
                pathPointer = connectPath({
                    targetNode: targetNode,
                    fromNode: node,
                    fromItem: item,
                    flowPosition: props.containerPosition,
                    nodePointerSize: props.nodePointerSize,
                    itemPointerSize: props.itemPointerSize,
                });
            }

            return(
                <ItemPanel 
                    key={index} 
                    item={item}
                    pathPointer={pathPointer}
                    itemPointerSize={props.itemPointerSize}
                />
            );
        })
    }

    const inputPointerLocation = useRef(null);
    const outputPointerLocation = useRef(null);

    // useEffect(() => {
    //     if (inputPointerLocation.current) {
    //         // const rect = inputPointerLocation.current.getBoundingClientRect();
    //         props.onPointerLocationUpdate();
    //     }
    //     if (outputPointerLocation.current) {
    //         // const rect = outputPointerLocation.current.getBoundingClientRect();
    //         props.onPointerLocationUpdate();
    //     }
    // });

    return (
        <div 
            className="flow-node" 
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
            <div 
                className="node-content" 
                style={{
                    width: node.width, 
                    height: node.height
                }}
            >
                {itemHtml}
            </div>

            <div className="node-pointer node-inputs">
                <div className="node-input" ref={inputPointerLocation}>
                    <svg width={props.nodePointerSize.width} height={props.nodePointerSize.height}>
                        <polygon points={svgPolygon} />
                    </svg>
                </div>
            </div>

            <div className="node-pointer node-outputs">
                <div className="node-output" ref={outputPointerLocation}>
                    <svg width={props.nodePointerSize.width} height={props.nodePointerSize.height}>
                        <polygon points={svgPolygon} />
                    </svg>
                </div>
            </div>
        </div>
    )
}