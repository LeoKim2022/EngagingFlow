/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';

import './engaging_flow.css';
import Node from './node'
import Connection from './connection'

import * as DEFINITION from './definition'
import {isEmptyArray} from '../function/common'
import {connectPath} from '../function/connect_path'
import {nodeData} from '../common/node_data'

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

    const connectSvgMargin = 5

    const [dragTargetNode, setDragTargetNode] = useState(null);
    const [nodeDragging, setNodeDragging] = useState(false);

    const [flowDragging, setFlowDragging] = useState(false);

    const [targetGap, setTargetGap] = useState({top: 0, left: 0});
    const [containerPosition, setContainerPosition] = useState({ top: 120, left: 120});

    const allNodeState = [];
    nodeData.forEach((nodeItem) => {
        const [nodeData, setNodeData] = useState(nodeItem);

        allNodeState.push({
            id: nodeItem.id,
            state: nodeData,
            stateFunc: setNodeData,
        })
    });

    function finishDrag() {
        setFlowDragging(false);
        setNodeDragging(false);
        setDragTargetNode(null);
    }

    function handleFlowMouseDown(event) {
        switch(event.buttons) {
            case MOUSE_BUTTONS_LEFT: {
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
            const findItem = allNodeState.find((element) => { return(element.id === dragTargetNode.getAttribute('id')) });
    
            if(findItem) {
                const nodeState = JSON.parse(JSON.stringify(findItem.state));

                nodeState.top  = event.clientY - targetGap.top;
                nodeState.left = event.clientX - targetGap.left;

                // TODO: Node는 background pattern 에 맞춰서 동작해야함.
    
                findItem.stateFunc(nodeState);
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

    const nodeHtml = allNodeState.map((node, index) => {
        return(
            <Node 
                key={index} 
                width={node.state.width} 
                height={node.state.height} 
                node={node.state}
                childData={allNodeState}
                containerPosition={containerPosition}
                nodePointerSize={nodePointerSize}
                itemPointerSize={itemPointerSize}
                onMouseDown={handleMouseDownOnNode}
                // onPointerLocationUpdate={updatePointerLocation}
            />
        )
    })

    const connectionHtml = [];
    
    allNodeState.forEach((node, index) => {
        
        const nodeState = node.state;

        if(!isEmptyArray(nodeState.items)) {
            nodeState.items.forEach((nodeItem, index) => {
                if(nodeItem.action !== undefined) {
                    const targetNode = allNodeState.find((element) => { return(element.id === nodeItem.action.id) });
                    if(targetNode) {

                        const pathInfo = connectPath({
                            toNode: targetNode.state,
                            fromNode: nodeState,
                            fromItem: nodeItem,
                            containerPosition: containerPosition,
                            nodePointerSize: nodePointerSize,
                            itemPointerSize: itemPointerSize,
                        });

                        if(pathInfo) {
                            connectionHtml.push(
                                <Connection 
                                    key={index} 
                                    fromNode={nodeState} 
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
                <svg className='node-connects'>
                    {connectionHtml}
                </svg>

                {nodeHtml}
            </div>
        </div>
    )
}

// TODO: flow background pattern
// 화면 원점에 pattern을 0,0 으로 맞추지 않음
// flow 드래그는 부드럽게 동작해야 한다.


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
  