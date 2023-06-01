import React, { useState, useRef, useEffect, useCallback } from 'react';

import {DEFINITION} from './definition'
import {isEmptyArray} from '../function/common'
import {connectPath} from '../function/connect_path'
import {nodeData} from '../common/node_data'
import {getParentElement, getGridPosition} from './flow_function'

import {GlobalConfigProvider} from '../context_global_config'

import './engaging_flow.css';
import Node from './node'
import Connection from './connection'
import FlowScrollBar from './flow_scrollbar'
import * as PointerHandle from './node_pointer_handle'
import ConfigPanel from '../config_panel';

import ControlBox from './control/control_box';

export default function EngagingFlow(props) {

    const parentWidthWithGap  = props.boxRect.width - (props.boxRect.width % DEFINITION.FLOW_GRID_SIZE) + DEFINITION.FLOW_GRID_SIZE;
    const parentHeightWithGap = props.boxRect.height - (props.boxRect.height % DEFINITION.FLOW_GRID_SIZE) + DEFINITION.FLOW_GRID_SIZE;

    /**********************************************************************/
    // set useState
    /**********************************************************************/
    const [dragTargetNode, setDragTargetNode] = useState(null);
    const [flowDragMode, setFlowDragMode] = useState(DEFINITION.FlowActionMode.none);

    const [targetDragInfo, setTargetDragInfo] = useState({top: 0, left: 0});
    const [editorScaleLev, setEditorScaleLev] = useState(11);

    const [containerPosition, setContainerPosition] = useState({ top: 0, left: 0});
    const [gridPosition, setGridPosition] = useState({ top: 0, left: 0});

    const [spaceKeyHold, setSpaceKeyHold] = useState(false);

    const [flowData, setFlowData] = useState(nodeData);

    const [outPointerDrag, setOutPointerDrag] = useState(null);

    const [mouseClientX, setMouseClientX] = useState(null);
    const [mouseClientY, setMouseClientY] = useState(null);

    const [highlightNode, setHighlightNode] = useState(null);
    const [highlightItem, setHighlightItem] = useState(null);

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
                if(spaceKeyHold) {
                    initFlowDragMode(event);
                } else {
                    setFlowDragMode(DEFINITION.FlowActionMode.rect);
                    setTargetDragInfo({
                        clientX: event.clientX,
                        clientY: event.clientY,
                    });

                }

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
                    let targetNode = getParentElement(event.target, 'flow-node');
                    if(!targetNode) {
                        setFlowDragMode(DEFINITION.FlowActionMode.none);
                        return;
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
    function handleMouseUpOnNode(event) {
        //
    }


    
    /**
     * 
     */    
    function handleMouseEnter() {
        document.getElementById(DEFINITION.FLOW_EDITOR_ID).focus();
    };

    
    /**
     * 
     */    
    function handleMouseUp(event) {
        // TODO: connectionDraw - handleMouseUp

        // console.log("🚀 ~ event:", event);        
        // console.log("🚀 ~ finishDrag:", flowDragMode);

        // if() {

        // }

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
        } else if(flowDragMode === DEFINITION.FlowActionMode.pointer && outPointerDrag) {
            // const scaleOrigin = editorScaleLev / DEFINITION.FLOW_SCALE_LEVEL_RATE;

            // const toPointer = {
            //     x: (event.clientX - props.boxRect.left) / scaleOrigin - containerPosition.left,
            //     y: (event.clientY - props.boxRect.top) / scaleOrigin - containerPosition.top,
            // }            

            // const pathInfoParam = Object.assign({}, outPointerDrag, { 
            //     toPointer: toPointer, 
            //     isTargetPointerEmpty: true,
            //     isFromNodePointer: true,
            // });
            // const pathInfo = connectPath(pathInfoParam);

            // const copyOutPointerDrag = JSON.parse(JSON.stringify(outPointerDrag));
            // copyOutPointerDrag.pathInfo = pathInfo;
            // setOutPointerDrag(copyOutPointerDrag);
        } else if(flowDragMode === DEFINITION.FlowActionMode.rect) {
            setMouseClientX(event.clientX);
            setMouseClientY(event.clientY);
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
        setOutPointerDrag(null);
        setMouseClientX(null);
        setMouseClientY(null);
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



    /**
     * 
     * @param  
     */
    function updateHighlightNode(event, element) {

        if(event.type === 'mouseenter') {
            const nodeId = element.getAttribute("id");
            if(nodeId) setHighlightNode(nodeId);
        } else {
            setHighlightNode(null);
        }

    }



    /**
     * 
     * @param  
     */
    function updateHighlightItem(event, element) {

        if(event.type === 'mouseenter') {
            const itemId = element.getAttribute("id");
            if(itemId) setHighlightItem(itemId);
        } else {
            setHighlightItem(null);
        }

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

                onNodeMouseDown={handleMouseDownOnNode}
                onNodeMouseUp={handleMouseUpOnNode}

                onOutputPointerMouseDown={(event) => { PointerHandle.handleMouseDownOutput(event, flowData, containerPosition, setFlowDragMode, setOutPointerDrag); }}

                onInputPointerMouseEnter={PointerHandle.handleMouseEnterInput}
                onInputPointerMouseLeave={PointerHandle.handleMouseLeaveInput}

                onUpdateHighlightNode={updateHighlightNode}
                onUpdateHighlightItem={updateHighlightItem}
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
                        });

                        if(pathInfo) {
                            connectionHtml.push(
                                <Connection 
                                    key={`${node.id}.${nodeItem.id}`} 
                                    nodeId={node.id}
                                    nodeItemId={nodeItem.id}
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

        if(node.action) {
            // TODO: node 에서 node로 가는 connection
            const targetNode = flowData.find((element) => { return(element.id === node.action.id) });
            if(targetNode) {
                const pathInfo = connectPath({
                    toNode: targetNode,
                    fromNode: node,
                    fromItem: {
                        top: node.height / 2 - DEFINITION.NodePointerSize.height / 2,
                        left: node.width - (DEFINITION.NodePointerSize.width),
                        width: DEFINITION.NodePointerSize.width,
                        height: DEFINITION.NodePointerSize.height,
                    },
                    isFromNodePointer: true,
                    containerPosition: containerPosition,
                });

                connectionHtml.push(
                    <Connection 
                        key={`${node.id}`} 
                        nodeId={node.id}
                        fromNode={node} 
                        pathInfo={pathInfo} 
                    />
                );
            }
        }
    })

    let containerDragClass;
    switch(flowDragMode) {
        case DEFINITION.FlowActionMode.node: {
            containerDragClass = 'node-dragging';
            break;
        }
    
        case DEFINITION.FlowActionMode.pointer: {
            containerDragClass = 'pointer-dragging';
            break;
        }
    
        default: {
            containerDragClass = '';
            break;
        }
    }

    return(
        <GlobalConfigProvider>
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
                        className={`flow-container ${containerDragClass}`} 
                        style={{
                            top: containerPosition.top, 
                            left: containerPosition.left
                        }} 
                    >
                        {nodeHtml}

                        <svg className='node-connects'>
                            {connectionHtml}
                            <Connection 
                                pathInfo={outPointerDrag?.pathInfo}
                            />
                        </svg>

                    </div>

                    <ControlBox 
                        targetDragInfo={targetDragInfo}
                        mouseClientX={mouseClientX}
                        mouseClientY={mouseClientY}
                        nodeData={flowData} 
                        editorScaleLev={editorScaleLev}
                        boxRect={props.boxRect}
                        containerPosition={containerPosition}
                        flowDragMode={flowDragMode}
                        highlightNode={highlightNode}
                        highlightItem={highlightItem}
                    />
                </div>


                <FlowScrollBar 
                    nodeData={flowData} 
                    type={DEFINITION.ScrollBarType.horizontal}
                    containerPosition={containerPosition}
                    boxRect={props.boxRect}
                    editorScaleLev={editorScaleLev}
                />

                <FlowScrollBar 
                    nodeData={flowData} 
                    type={DEFINITION.ScrollBarType.vertical}
                    containerPosition={containerPosition}
                    boxRect={props.boxRect}
                    editorScaleLev={editorScaleLev}
                />

                {/* <div 
                    style={{
                        position: 'absolute',
                        width: 'fit-content',
                        height: 'fit-content',
                        bottom: 20,
                        right: 20,
                        padding: `15px 25px`,
                        borderRadius: 10,
                        backgroundColor: 'gray',
                        color: 'white',
                        cursor: 'pointer',
                    }}

                    onClick={() => {
                        setFlowData(nodeData);
                    }}
                >
                    <span>Load Data</span>
                </div> */}
            </div>
            <ConfigPanel />

            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    padding: '10px 10px 10px 0px',
                    backgroundColor: 'lightgray',
                    borderTopLeftRadius: 10,
                    textAlign: 'left',
                }}
            >
                <div style={{marginLeft: 20}}><span>Update log</span></div>
                <ul>
                    <li>drawing rect by drag on flow-editor</li>
                    <li>'Flow Config' with useContext()</li>
                </ul>
            </div>

        </GlobalConfigProvider>
    )
}

  