/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';

import {DEFINITION} from './definition'
import {isEmptyArray} from '../function/common'
import {connectPath} from '../function/connect_path'
import {nodeData} from '../common/node_data'

import './engaging_flow.css';
import Node from './node'
import Connection from './connection'
import FlowScrollBar from './flow_scrollbar'


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
    const editorScaleOrigin = editorScale / DEFINITION.FLOW_SCALE_LEVEL_RATE;

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

    const [targetDragInfo, setTargetDragInfo] = useState({top: 0, left: 0});
    const [editorScaleLev, setEditorScaleLev] = useState(13);

    const [containerPosition, setContainerPosition] = useState({ top: 0, left: 0});
    const [gridPosition, setGridPosition] = useState({ top: 0, left: 0});

    const [spaceKeyHold, setSpaceKeyHold] = useState(false);

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
                if(spaceKeyHold) initFlowDragMode(event);
                break;
            }
        
            case DEFINITION.MouseButtons.right: {
                break;
            }
        
            case DEFINITION.MouseButtons.wheel: {
                initFlowDragMode(event);
                break;
            }
        
            default: {
                break;
            }
        }
    };



    /**
     * 
     * @param event 
     */
    function handleKeyDown(event) {
        switch(event.keyCode) {
            case DEFINITION.KeyCode.space: {
                setSpaceKeyHold(true);
                break;
            }
        }
    }


    
    /**
     * 
     * @param event 
     */    
    function handleKeyUp(event) {
        switch(event.keyCode) {
            case DEFINITION.KeyCode.space: {
                setSpaceKeyHold(false);
                break;
            }
        }
    }


    
    /**
     * 
     * @param event 
     */    
    function handleMouseDownOnNode(event) {
        switch(event.buttons) {
            case DEFINITION.MouseButtons.left: {
                if(spaceKeyHold) {
                    initFlowDragMode(event);
                } else {
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
            
                    setTargetDragInfo({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        targetTop : findItem.state.top,
                        targetLeft: findItem.state.left,
                    });                    
                }
                break;
            }
        
            case DEFINITION.MouseButtons.right: {
                console.log("🚀 ~ DEFINITION.MouseButtons.right");
                break;
            }
        
            case DEFINITION.MouseButtons.wheel: {
                console.log("🚀 ~ DEFINITION.MouseButtons.wheel");
                initFlowDragMode(event);
                break;
            }
        
            default: {
                break;
            }
        }
    };


    
    /**
     * 
     */    
    function handleMouseEnter() {
        document.getElementById('engaging_editor').focus();
    };

    
    /**
     * 
     */    
    function handleMouseUp() {
        finishDrag();
    };


    
    /**
     * 
     */    
    function handleMouseLeave() {
        finishDrag();
    };


    
    /**
     * 
     * @param event 
     */    
    function handleMouseMove(event) {
        if (flowDragMode === DEFINITION.FlowActionMode.node && dragTargetNode) {
            const findItem = allNodeState.find((element) => { return(element.id === dragTargetNode.getAttribute('id')) });
    
            if(findItem) {
                const nodeState   = JSON.parse(JSON.stringify(findItem.state));
                const scaleOrigin = editorScaleLev / DEFINITION.FLOW_SCALE_LEVEL_RATE;

                let newTop  = (event.clientY - targetDragInfo.clientY) / scaleOrigin + targetDragInfo.targetTop;
                let newLeft = (event.clientX - targetDragInfo.clientX) / scaleOrigin + targetDragInfo.targetLeft;

                newTop = Math.round(newTop / DEFINITION.FLOW_GRID_SIZE) * DEFINITION.FLOW_GRID_SIZE;
                newLeft = Math.round(newLeft / DEFINITION.FLOW_GRID_SIZE) * DEFINITION.FLOW_GRID_SIZE;

                nodeState.top  = newTop;
                nodeState.left = newLeft;

                findItem.stateFunc(nodeState);
            }
        } else if(flowDragMode === DEFINITION.FlowActionMode.flow) {
            const scaleOrigin = editorScaleLev / DEFINITION.FLOW_SCALE_LEVEL_RATE;

            const newTop  = (event.clientY - targetDragInfo.clientY) / scaleOrigin + targetDragInfo.targetTop;
            const newLeft = (event.clientX - targetDragInfo.clientX) / scaleOrigin + targetDragInfo.targetLeft;

            setContainerPosition({
                top : newTop,
                left: newLeft,
            });
        }
    };


    
    /**
     * 
     * @param event 
     */    
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

            const newScaleLev = editorScaleLev + DEFINITION.FLOW_SCALE_STEP * scaleVal;

            if(DEFINITION.FLOW_SCALE_MIN <= newScaleLev && newScaleLev <= DEFINITION.FLOW_SCALE_MAX) {

                const prevScaleLev = editorScaleLev; 
                setEditorScaleLev(newScaleLev);

                const prevScaleOrigin = prevScaleLev / DEFINITION.FLOW_SCALE_LEVEL_RATE;
                const newScaleOrigin  = newScaleLev / DEFINITION.FLOW_SCALE_LEVEL_RATE;

                const editorPosition = document.getElementById('engaging_editor').getBoundingClientRect();
                
                const locFromEditor = {
                    x: event.clientX - editorPosition.left,
                    y: event.clientY - editorPosition.top,
                }

                const xMovement = ((locFromEditor.x * (1 / prevScaleOrigin) * newScaleOrigin - locFromEditor.x) * -1) / newScaleOrigin;
                const yMovement = ((locFromEditor.y * (1 / prevScaleOrigin) * newScaleOrigin - locFromEditor.y) * -1) / newScaleOrigin;

                // 마우스 포인터 위치에서 줌이 되어야 한다.
                setContainerPosition({
                    top: containerPosition.top + yMovement,
                    left: containerPosition.left + xMovement,
                })
            }
        } else {
            let scaleVal;
            if(event.deltaY > 0) {
                scaleVal = -1;
            } else if(event.deltaY < 0) {
                scaleVal = 1;
            }

            setContainerPosition({
                top: containerPosition.top + DEFINITION.FLOW_GRID_SIZE * scaleVal,
                left: containerPosition.left,
            })
        }
    };


    /**********************************************************************/
    // Function
    /**********************************************************************/

    /**
     * 
     */
    function finishDrag() {
        setFlowDragMode(DEFINITION.FlowActionMode.none);
        setDragTargetNode(null);
    }



    /**
     * 
     * @param mouseEvent 
     */
    function initFlowDragMode(mouseEvent) {
        setFlowDragMode(DEFINITION.FlowActionMode.flow);

        setTargetDragInfo({
            clientX: mouseEvent.clientX,
            clientY: mouseEvent.clientY,
            targetTop : containerPosition.top,
            targetLeft: containerPosition.left,
        });
    }



    /**
     * 
     * @param  
     */
    function updateGridPosition() {
        const gridPosition = getGridPosition(editorScaleLev, containerPosition, {
            width: parentWidthWithGap,
            height: parentHeightWithGap
        });

        setGridPosition(gridPosition);
    }


    /**********************************************************************/
    // set useEffect
    /**********************************************************************/ 
    const engagingEditorRef = useRef(null);
    useEffect(() => {
        const refCurrent = engagingEditorRef.current;

        if(refCurrent) {
            refCurrent.addEventListener('wheel', handleWheel, { passive: false });
        }

        updateGridPosition();

        return(() => {
            if(refCurrent) {
                refCurrent.removeEventListener('wheel', handleWheel);
            } 
        });
    }, [editorScaleLev, containerPosition]);


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
                                    key={`${nodeState.id}.${nodeItem.id}`} 
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

    return(
        <div 
            id='engaging_editor'
            className='engaging-editor' 

            ref={engagingEditorRef}

            onMouseDown={handleFlowMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}

            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}

            tabIndex={0}
        >
            <div 
                className='engaging-grid' 
                style={{
                    top:`${gridPosition.top}px`,
                    left:`${gridPosition.left}px`,
                    width: `${parentWidthWithGap * 3}px`,
                    height: `${parentHeightWithGap * 3}px`,
                    transform: `scale(${editorScaleLev / 10})`,
                    backgroundSize: `${DEFINITION.FLOW_GRID_SIZE}px ${DEFINITION.FLOW_GRID_SIZE}px`
                }}
            />

            <div 
                className='engaging-flow' 

                style={{
                    transform: `scale(${editorScaleLev / 10})`,
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

  