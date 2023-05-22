// import React, { useState, useRef, useEffect } from 'react';
import {nodePointerTriangle} from '../function/node_pointer_polygon'

function ItemPanel(props) {
    const item = props.item;
    
    let panelPointHtml;
    if(props.pathPointer) {
        console.log("🚀 ~ props:", props);
        const itemPointerSize = props.itemPointerSize;

        const svgPoints = nodePointerTriangle(itemPointerSize);

        panelPointHtml = 
            <div 
                className={`panel-point ${props.pathPointer.edge}`}
            >
                <svg
                    style={{
                        width: itemPointerSize.width, 
                        height: itemPointerSize.height
                    }}
                >
                    <polygon points={svgPoints}></polygon>
                </svg>
            </div>
        ;
    }

    return (
        <div 
            className="item-panel" 
            id={item.id}
            style={{
                top: item.top, 
                left: item.left, 
                width: item.width, 
                height: item.height
            }}
        >
            {panelPointHtml}
        </div>
    );
}

export default ItemPanel;