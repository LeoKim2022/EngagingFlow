/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';

import './engaging_flow.css';
import Node from './node'
import Connection from './connection'

import {DEFINITION} from './definition'
import {isEmptyArray} from '../function/common'
import {connectPath} from '../function/connect_path'
import {nodeData} from '../common/node_data'

export default function EngagingFlow(props) {

    const NodePointerSize = DEFINITION.NodePointerSize;
    const ItemPointerSize = DEFINITION.ItemPointerSize;

    // 사용자의 드래그가 화면 끝에서 화면 끝까지 발생한다고 가정했을때,
    // 양쪽으로 box의 크기만큼 Grid영역이 필요하므로 실제 사용할때는 본체, 좌우를 고려하여 3배를 사용해야 한다.
    const parentWidthWithGap  = props.boxWidth - (props.boxWidth % DEFINITION.FLOW_GRID_SIZE) + DEFINITION.FLOW_GRID_SIZE;
    const parentHeightWithGap = props.boxHeight - (props.boxHeight % DEFINITION.FLOW_GRID_SIZE) + DEFINITION.FLOW_GRID_SIZE;
    /**********************************************************************/
    // set useState
    /**********************************************************************/
    const [dragTargetNode, setDragTargetNode] = useState(null);
    const [flowDragMode, setFlowDragMode] = useState(DEFINITION.FlowActionMode.none);

    const [targetGap, setTargetGap] = useState({top: 0, left: 0});
    const [editorScale, setEditorScale] = useState(10);

    const [containerPosition, setContainerPosition] = useState({ top: 0, left: 0});
    const [gridPosition, setGridPosition] = useState({ top: 0, left: 0});

    const allNodeState = [];
    nodeData.forEach((nodeItem) => {
        const [nodeData, setNodeData] = useState(nodeItem);

        allNodeState.push({
            id: nodeItem.id,
            state: nodeData,
            stateFunc: setNodeData,
        })
    });

    /**********************************************************************/
    // event handler
    /**********************************************************************/

    /**
     * 
     * @param event 
     */
    function handleFlowMouseDown(event) {
        switch(event.buttons) {
            case DEFINITION.MouseButtons.left: {
                break;
            }
        
            case DEFINITION.MouseButtons.right: {
                break;
            }
        
            case DEFINITION.MouseButtons.wheel: {
                setFlowDragMode(DEFINITION.FlowActionMode.flow);

                setTargetGap({
                    left: event.clientX - containerPosition.left,
                    top: event.clientY - containerPosition.top,
                });
    
                break;
            }
        
            default: {
                break;
            }
        }
    };

    function handleMouseDownOnNode(event) {
        
        let targetNode = getFlowNodeDiv(event.target);
        if(!targetNode) {
            setFlowDragMode(DEFINITION.FlowActionMode.none);
        } else {
            setFlowDragMode(DEFINITION.FlowActionMode.node);
        }

        setDragTargetNode(targetNode);
        const findItem = allNodeState.find((element) => { return(element.id === targetNode.getAttribute('id')) });
        if(!findItem) {
            setFlowDragMode(DEFINITION.FlowActionMode.none);
        }

        setTargetGap({
            left: event.clientX - findItem.state.left,
            top: event.clientY - findItem.state.top,
        });
    };

    function handleMouseUp() {
        finishDrag();
    };

    function handleMouseLeave() {
        finishDrag();
    };

    function handleMouseMove(event) {
        if (flowDragMode === DEFINITION.FlowActionMode.node && dragTargetNode) {
            const findItem = allNodeState.find((element) => { return(element.id === dragTargetNode.getAttribute('id')) });
    
            if(findItem) {
                const nodeState = JSON.parse(JSON.stringify(findItem.state));

                nodeState.top  = event.clientY - targetGap.top;
                nodeState.left = event.clientX - targetGap.left;

                // TODO: Node는 background pattern 에 맞춰서 동작해야함.
    
                console.log("🚀 ~ nodeState:", nodeState);
                
                findItem.stateFunc(nodeState);
            }
        } else if(flowDragMode === DEFINITION.FlowActionMode.flow) {
            setContainerPosition({
                top : event.clientY - targetGap.top,
                left: event.clientX - targetGap.left,
            });
        }
    };

    function handleWheel(event) {
        
        if(event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();

            let scaleVal;
            if(event.deltaY > 0) {
                scaleVal = -1;
            } else if(event.deltaY < 0) {
                scaleVal = 1;
            }

            const newScale = editorScale + DEFINITION.FLOW_SCALE_STEP * scaleVal;
            if(DEFINITION.FLOW_SCALE_MIN <= newScale && newScale <= DEFINITION.FLOW_SCALE_MAX) {
                setEditorScale(newScale);
            }
        } else {
            if(event.deltaY > 0) {
                console.log("🚀 ~ wheel down:", );
            } else if(event.deltaY < 0) {
                console.log("🚀 ~ wheel up:", );
            } else {
                console.log("🚀 ~ wheel same:", );
            }
        }
    };


    /**********************************************************************/
    // Function
    /**********************************************************************/
    function finishDrag() {
        setFlowDragMode(DEFINITION.FlowActionMode.none);
        setDragTargetNode(null);
    }


    /**********************************************************************/
    // set useEffect
    /**********************************************************************/
    useEffect(() => {
        const element = document.getElementById('engaging_editor');
        element.addEventListener('wheel', handleWheel, { passive: false });
    }, [editorScale]);

    useEffect(() => {
        const gridPosition = getGridPosition(editorScale, containerPosition, {
            width: parentWidthWithGap,
            height: parentHeightWithGap
        });
        setGridPosition(gridPosition);
    }, [containerPosition]);

    /**********************************************************************/
    // make html parts
    /**********************************************************************/
    const nodeHtml = allNodeState.map((node, index) => {
        return(
            <Node 
                key={index} 
                width={node.state.width} 
                height={node.state.height} 
                node={node.state}
                childData={allNodeState}
                containerPosition={containerPosition}
                nodePointerSize={NodePointerSize}
                itemPointerSize={ItemPointerSize}
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
                            nodePointerSize: NodePointerSize,
                            itemPointerSize: ItemPointerSize,
                        });

                        if(pathInfo) {
                            connectionHtml.push(
                                <Connection 
                                    key={index} 
                                    fromNode={nodeState} 
                                    fromItem={nodeItem} 
                                    pathInfo={pathInfo} 
                                />
                            )
                        }

                    }
                }
            });
        }
    })



    // const gridPosition = getGridPosition(editorScale, containerPosition, {
    //     width : parentWidthWithGap,
    //     height: parentHeightWithGap,
    // });


    return(
        <div 
            className='engaging-editor' 
            id='engaging_editor'

            onMouseDown={handleFlowMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            <div 
                className='engaging-grid' 
                style={{
                    top:`${gridPosition.top}px`,
                    left:`${gridPosition.left}px`,
                    width: `${parentWidthWithGap * 3}px`,
                    height: `${parentHeightWithGap * 3}px`,
                    transform: `scale(${editorScale / 10})`,
                    backgroundSize: `${DEFINITION.FLOW_GRID_SIZE}px ${DEFINITION.FLOW_GRID_SIZE}px`
                }}
            />

            <div 
                
                className='engaging-flow' 
                tabIndex={0}

                style={{
                    transform: `scale(${editorScale / 10})`,
                }}
    
                onKeyDown={() => { 
                    // console.log("🚀 ~ onKeyDown"); 
                }}
            >
                <div 
                    className={`flow-container ${flowDragMode === DEFINITION.FlowActionMode.node ? 'node-dragging': ''}`} 
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



/**
 * 
 */
function getGridPosition(editorScale, containerPosition, parentSizeWithGap) {
    const editorScaleOrigin = editorScale / 10;

    // FLOW_GRID_SIZE 단위에서 flow container가 이동한 만큼 gird도 움직여야 하며, 그 거리는 scale 배율에 비례합니다.
    let gridTop = (DEFINITION.FLOW_GRID_SIZE - (containerPosition.top % DEFINITION.FLOW_GRID_SIZE)) * editorScaleOrigin * -1;

    // 양옆으로 항상 드래그가 가능한 영역이 추가로 있어야 합니다.
    gridTop += (parentSizeWithGap.height * editorScaleOrigin * -1 - editorScaleOrigin);

    let gridLeft = (DEFINITION.FLOW_GRID_SIZE - (containerPosition.left % DEFINITION.FLOW_GRID_SIZE)) * editorScaleOrigin * -1;
    gridLeft += (parentSizeWithGap.width * editorScaleOrigin * -1 - editorScaleOrigin);

    return({
        top : gridTop,
        left: gridLeft,
    })
}
  