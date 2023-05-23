/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';

import './engaging_flow.css';
import Node from './node'
import Connection from './connection'

import {connectPath} from '../function/connect_path'

const MOUSE_BUTTONS_LEFT  = 1;
const MOUSE_BUTTONS_WHEEL = 4;
const MOUSE_BUTTONS_RIGHT = 2;

export default function EngagingFlow(props) {

    const nodePointerSize = {
        width: 16,
        height: 14,
    }

    const itemPointerSize = {
        width: 9,
        height: 7,
    }

    const nodeWidth  = 100
    const nodeHeight = nodeWidth * 1.6

    const connectSvgMargin = 5

    const [dragTargetNode, setDragTargetNode] = useState(null);
    const [nodeDragging, setNodeDragging] = useState(false);

    const [flowDragging, setFlowDragging] = useState(false);

    const [targetGap, setTargetGap] = useState({top: 0, left: 0});
    const [containerPosition, setContainerPosition] = useState({ top: 120, left: 120});

    const [childData, setChildData] = useState([
        {
            id: 'aaa',
            top: 80,
            left: 50,
            width: nodeWidth,
            height: nodeHeight,
            items: [
                {
                    id: "a1",
                    top: 10,
                    left: 20,
                    width: 50,
                    height: 30,
                },
                {
                    id: "b3",
                    top: 120,
                    left: 30,
                    width: 20,
                    height: 30,
                    action: {
                        id: "eee",
                    }
                },
            ]
        },
        {
            id: 'bbb',
            top: 50,
            left: 250,
            width: nodeWidth,
            height: nodeHeight,
            items: [
            ]
        },
        {
            id: 'ccc',
            top: 50,
            left: 450,
            width: nodeWidth,
            height: nodeHeight,
            items: [
                {
                    id: "c1",
                    top: 40,
                    left: 40,
                    width: 50,
                    height: 50,
                },
            ]
        },
        {
            id: 'ddd',
            top: 300,
            left: 50,
            width: nodeWidth,
            height: nodeHeight,
            items: [
                {
                    id: "d1",
                    top: 10,
                    left: 20,
                    width: 50,
                    height: 50,
                },
                {
                    id: "d2",
                    top: 80,
                    left: 30,
                    width: 50,
                    height: 50,
                },
            ]
        },
        {
            id: 'eee',
            top: 350,
            left: 350,
            width: nodeWidth,
            height: nodeHeight,
            items: [
                {
                    id: "e1",
                    top: 10,
                    left: 10,
                    width: 20,
                    height: 20,
                },
                {
                    top: 10,
                    left: 40,
                    width: 15,
                    height: 15,
                },
                {
                    top: 10,
                    left: 65,
                    width: 20,
                    height: 15,
                },
                {
                    top: 40,
                    left: 10,
                    width: 25,
                    height: 25,
                },
                {
                    top: 40,
                    left: 70,
                    width: 20,
                    height: 20,
                },
                {
                    top: 110,
                    left: 10,
                    width: 15,
                    height: 15,
                },
                {
                    top: 110,
                    left: 40,
                    width: 20,
                    height: 20,
                },
                {
                    top: 110,
                    left: 70,
                    width: 13,
                    height: 13,
                },
            ]
        },
        {
            id: 'fff',
            top: 350,
            left: 550,
            width: nodeWidth,
            height: nodeHeight,
            items: [
                {
                    top: 40,
                    left: 40,
                    width: 50,
                    height: 50,
                },
            ]
        },
        {
            id: 'ggg',
            top: 500,
            left: 50,
            width: nodeWidth,
            height: nodeHeight,
            items: [
                {
                    top: 10,
                    left: 20,
                    width: 50,
                    height: 50,
                },
                {
                    top: 80,
                    left: 30,
                    width: 50,
                    height: 50,
                },
            ]
        },
        {
            id: 'hhh',
            top: 550,
            left: 350,
            width: nodeWidth,
            height: nodeHeight,
            items: [
                {
                    top: 10,
                    left: 10,
                    width: 50,
                    height: 50,
                },
                {
                    top: 100,
                    left: 30,
                    width: 50,
                    height: 50,
                },
            ]
        },
        {
            id: 'iii',
            top: 600,
            left: 550,
            width: nodeWidth,
            height: nodeHeight,
            items: [
                {
                    top: 40,
                    left: 40,
                    width: 50,
                    height: 50,
                },
            ]
        },
    ]);

    function finishDrag() {
        setFlowDragging(false);
        setNodeDragging(false);
        setDragTargetNode(null);
    }

    function handleFlowMouseDown(event) {
        switch(event.buttons) {
            case MOUSE_BUTTONS_LEFT: {
                console.log("🚀 ~ MOUSE_BUTTONS_LEFT:", MOUSE_BUTTONS_LEFT);
                break;
            }
        
            case MOUSE_BUTTONS_WHEEL: {
                setFlowDragging(true);

                setTargetGap({
                    left: event.clientX - containerPosition.left,
                    top: event.clientY - containerPosition.top,
                });
    
                break;
            }
        
            case MOUSE_BUTTONS_RIGHT: {
                console.log("🚀 ~ MOUSE_BUTTONS_RIGHT:", MOUSE_BUTTONS_RIGHT);
                break;
            }
        
            default: {
                break;
            }
        }
    };

    function handleMouseDownOnNode(event) {
        setNodeDragging(true);

        let targetNode = getFlowNodeDiv(event.target);
        if(!targetNode) {
            setNodeDragging(false);
        }

        setDragTargetNode(targetNode);
        const rect = event.target.getBoundingClientRect();

        setTargetGap({
            left: event.clientX - rect.x + containerPosition.left,
            top: event.clientY - rect.y + containerPosition.top,
        });
    };

    function handleMouseUp() {
        finishDrag();
    };

    function handleMouseLeave() {
        finishDrag();
    };

    function handleMouseMove(event) {
        if (nodeDragging && dragTargetNode) {
            const newChildData = [...childData];
            const findItem = newChildData.find((element) => { return(element.id === dragTargetNode.getAttribute('id')) });
    
            if(findItem) {
                findItem.top  = event.clientY - targetGap.top;
                findItem.left = event.clientX - targetGap.left;
    
                setChildData(newChildData);
            }
        } else if(flowDragging) {
            setContainerPosition({
                top : event.clientY - targetGap.top,
                left: event.clientX - targetGap.left,
            });
        }
        
    };

    // function updatePointerLocation() {
    // }

    const nodeHtml = childData.map((node, index) => {
        return(
            <Node 
                key={index} 
                width={nodeWidth} 
                height={nodeHeight} 
                node={node}
                childData={childData}
                flowPosition={containerPosition}
                nodePointerSize={nodePointerSize}
                itemPointerSize={itemPointerSize}
                onMouseDown={handleMouseDownOnNode}
                // onPointerLocationUpdate={updatePointerLocation}
            />
        )
    })

    const connectionHtml = [];
    
    childData.forEach((node, index) => {
        if(Array.isArray(node.items)  && node.items.length > 0) {
            node.items.forEach((nodeItem, index) => {
                if(nodeItem.action !== undefined) {
                    const targetNode = childData.find((element) => { return(element.id === nodeItem.action.id) });
                    if(targetNode) {

                        const pathInfo = connectPath({
                            targetNode: targetNode,
                            fromNode: node,
                            fromItem: nodeItem,
                            flowPosition: containerPosition,
                            nodePointerSize: nodePointerSize,
                            itemPointerSize: itemPointerSize,
                        });

                        if(pathInfo) {
                            connectionHtml.push(
                                <Connection 
                                    key={index} 
                                    fromNode={node} 
                                    fromItem={nodeItem} 
                                    pathInfo={pathInfo} 
                                    connectSvgMargin={connectSvgMargin}
                                />
                            )
                        }

                    }
                }
            });
        }
    })

    return(
        <div 
            className="engaging-flow" 

            style={{
                width: props.width, 
                height: props.height
            }}

            onMouseDown={handleFlowMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            <div 
                className={`flow-container ${nodeDragging? 'dragging': ''}`} 
                style={{
                    top: containerPosition.top, 
                    left: containerPosition.left
                }} 
            >
                <div className='node-connects'> {connectionHtml} </div>
                {nodeHtml}
            </div>
        </div>
    )
}
 


/**
 * 
 */
function getFlowNodeDiv(element) {
    let parent = element.parentNode;
  
    while (parent) {
        if (parent.classList.contains('flow-node')) {
            return parent;
        }
        parent = parent.parentNode;
    }
  
    return null;
  }
  