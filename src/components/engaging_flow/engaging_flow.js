import React, { useState, useRef, useEffect, useCallback } from 'react';

import {DEFINITION} from './definition'
import {isEmptyArray} from '../function/common'
import {connectPath} from '../function/connect_path'
import {nodeData} from '../common/node_data'

import './engaging_flow.css';
import Node from './node'
import Connection from './connection'
import FlowScrollBar from './flow_scrollbar'
import * as PointerHandle  from './node_pointer_handle'


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

    const parentWidthWithGap  = props.boxSize.width - (props.boxSize.width % DEFINITION.FLOW_GRID_SIZE) + DEFINITION.FLOW_GRID_SIZE;
    const parentHeightWithGap = props.boxSize.height - (props.boxSize.height % DEFINITION.FLOW_GRID_SIZE) + DEFINITION.FLOW_GRID_SIZE;

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

    const [flowData, setFlowData] = useState(nodeData);

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

            default: {
                break
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

            default: {
                break
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
                    const findItem = flowData.find((element) => { return(element.id === targetNode.getAttribute('id')) });
                    if(!findItem) {
                        setFlowDragMode(DEFINITION.FlowActionMode.none);
                    }
            
                    setTargetDragInfo({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        targetTop : findItem.top,
                        targetLeft: findItem.left,
                    });                    
                }
                break;
            }
        
            case DEFINITION.MouseButtons.right: {
                console.log("🚀 ~ DEFINITION.MouseButtons.right");
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
     */    
    function handleMouseEnter() {
        document.getElementById(DEFINITION.FLOW_EDITOR_ID).focus();
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
            const copyFlowData = JSON.parse(JSON.stringify(flowData));

            const findItem = copyFlowData.find((element) => { return(element.id === dragTargetNode.getAttribute('id')) });
    
            if(findItem) {
                const scaleOrigin = editorScaleLev / DEFINITION.FLOW_SCALE_LEVEL_RATE;

                let newTop  = (event.clientY - targetDragInfo.clientY) / scaleOrigin + targetDragInfo.targetTop;
                let newLeft = (event.clientX - targetDragInfo.clientX) / scaleOrigin + targetDragInfo.targetLeft;

                newTop = Math.round(newTop / DEFINITION.FLOW_GRID_SIZE) * DEFINITION.FLOW_GRID_SIZE;
                newLeft = Math.round(newLeft / DEFINITION.FLOW_GRID_SIZE) * DEFINITION.FLOW_GRID_SIZE;

                if(
                    findItem.top !== newTop ||
                    findItem.left !== newLeft
                ) {
                    findItem.top  = newTop;
                    findItem.left = newLeft;
    
                    setFlowData(copyFlowData);
                }
            }
        } else if(flowDragMode === DEFINITION.FlowActionMode.flow) {
            const scaleOrigin = editorScaleLev / DEFINITION.FLOW_SCALE_LEVEL_RATE;

            const newTop  = (event.clientY - targetDragInfo.clientY) / scaleOrigin + targetDragInfo.targetTop;
            const newLeft = (event.clientX - targetDragInfo.clientX) / scaleOrigin + targetDragInfo.targetLeft;

            setContainerPosition({
                top : newTop,
                left: newLeft,
            });
        } else if(flowDragMode === DEFINITION.FlowActionMode.pointer) {
            console.log("🚀 ~ event:", event);
            // TODO: pointer에서 마우스 down이 발생한후 마우스가 움직일때
        }
    };


    
    /**
     * 
     * @param event 
     */    
    const handleWheel = useCallback((event) => {
        
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

                const editorPosition = document.getElementById(DEFINITION.FLOW_EDITOR_ID).getBoundingClientRect();
                
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
    }, [containerPosition, editorScaleLev]);


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
    const updateGridPosition = useCallback(() => {
        const gridPosition = getGridPosition(editorScaleLev, containerPosition, {
            width: parentWidthWithGap,
            height: parentHeightWithGap
        });

        setGridPosition(gridPosition);
    }, [editorScaleLev, containerPosition, parentWidthWithGap, parentHeightWithGap]);


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
    }, [updateGridPosition, handleWheel]);


    /**********************************************************************/
    // make html parts
    /**********************************************************************/
    const nodeHtml = flowData.map((node, index) => {
        return(
            <Node 
                key={index} 
                width={node.width} 
                height={node.height} 
                node={node}
                childData={flowData}
                containerPosition={containerPosition}
                nodePointerSize={NodePointerSize}
                itemPointerSize={ItemPointerSize}

                onNodeMouseDown={handleMouseDownOnNode}

                onOutputPointerMouseDown={(event) => {
                    PointerHandle.handleMouseDownOutput(event, setFlowDragMode);
                }}

                onInputPointerMouseEnter={PointerHandle.handleMouseEnterInput}
                onInputPointerMouseLeave={PointerHandle.handleMouseLeaveInput}
            />
        )
    })

    const connectionHtml = [];
    
    flowData.forEach((node, index) => {
        if(!isEmptyArray(node.items)) {
            node.items.forEach((nodeItem, index) => {
                if(nodeItem.action !== undefined) {
                    const targetNode = flowData.find((element) => { return(element.id === nodeItem.action.id) });
                    if(targetNode) {
                        const pathInfo = connectPath({
                            toNode: targetNode,
                            fromNode: node,
                            fromItem: nodeItem,
                            containerPosition: containerPosition,
                            nodePointerSize: NodePointerSize,
                            itemPointerSize: ItemPointerSize,
                        });

                        if(pathInfo) {
                            connectionHtml.push(
                                <Connection 
                                    key={`${node.id}.${nodeItem.id}`} 
                                    fromNode={node} 
                                    fromItem={nodeItem} 
                                    pathInfo={pathInfo} 
                                />
                            )
                        }

                    }
                }
            });
        }

        // if(node.action) {
        //     // TODO: node 에서 node로 가는 connection
        //     const targetNode = flowData.find((element) => { return(element.id === node.action.id) });
        //     if(targetNode) {
        //         const pathInfo = connectPath({
        //             toNode: targetNode,
        //             fromNode: node,
        //             fromItem: {
        //                 top: 0,
        //                 left: 0,
        //                 width: DEFINITION.ItemPointerSize.width,
        //                 height: DEFINITION.ItemPointerSize.height,
        //             },
        //             containerPosition: containerPosition,
        //             nodePointerSize: NodePointerSize,
        //             itemPointerSize: ItemPointerSize,
        //         });

        //         //
        //     }
        // }
    })

    return(
        <div 
            id={DEFINITION.FLOW_EDITOR_ID}
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
                        {/* TODO: 사용자가 직접 드로우 하는 connection 전용 */}
                        <Connection 
                            
                        />
                    </svg>

                    {nodeHtml}
                </div>
            </div>

            <FlowScrollBar 
                nodeData={flowData} 
                type={DEFINITION.ScrollBarType.horizontal}
                containerPosition={containerPosition}
                boxSize={props.boxSize}
                editorScaleLev={editorScaleLev}
            />

            <FlowScrollBar 
                nodeData={flowData} 
                type={DEFINITION.ScrollBarType.vertical}
                containerPosition={containerPosition}
                boxSize={props.boxSize}
                editorScaleLev={editorScaleLev}
            />

            <div 
                style={{
                    position: 'absolute',
                    width: 200,
                    height: 60,
                    bottom: 10,
                    right: 10,
                    backgroundColor: 'gray',
                }}

                onClick={() => {
                    setFlowData(nodeData);
                }}
            >
                <span>Load Data</span>
            </div>
        </div>
    )
}

  