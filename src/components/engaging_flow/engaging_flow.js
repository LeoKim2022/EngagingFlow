import React, { useState, useRef, useEffect, useCallback, useReducer } from 'react';

// DEFINITION & function
import {DEFINITION} from './definition'
import {isAPointInBRect, isEmptyArray} from '../function/common'
import {connectPath} from '../function/connect_path'
import {nodeData} from '../common/node_data'
import {
    convertClientDistanceToFlow, 
    findNodeByItemId,
    findNodeElement, 
    getParentElement, 
    getSelectedItemInitData, 
    getGridPosition
} from './flow_function'
import {selectedItemRect} from './control/control_function'
import {convertClientCoordToFlow} from './flow_function'

// CSS
import './engaging_flow.css';

// Component parts
import Node from './node'
import Connection from './connection'
import FlowScrollBar from './flow_scrollbar'
import * as PointerHandle from './node_pointer_handle'
import ConfigPanel from '../config_panel';
import ControlBox from './control/control_box';

// Context
import {useFlowData} from '../context_flow_data'
// Node elements


export default function EngagingFlow(props) {

    const parentWidthWithGap  = props.boxRect.width - (props.boxRect.width % DEFINITION.FLOW_GRID_SIZE) + DEFINITION.FLOW_GRID_SIZE;
    const parentHeightWithGap = props.boxRect.height - (props.boxRect.height % DEFINITION.FLOW_GRID_SIZE) + DEFINITION.FLOW_GRID_SIZE;

    /**********************************************************************/
    // set useState
    /**********************************************************************/
    // const [dragTargetNode, setDragTargetNode] = useState(null);
    const [flowDragMode, setFlowDragMode] = useState(DEFINITION.FlowActionMode.none);

    const [cursorPositionBegin, setCursorPositionBegin] = useState({clientX: 0, clientY: 0, dragTarget: []});
    const [editorScaleLev, setEditorScaleLev] = useState(11);

    const [containerPosition, setContainerPosition] = useState({ top: 0, left: 0});
    const [gridPosition, setGridPosition] = useState({ top: 0, left: 0});

    const [spaceKeyHold, setSpaceKeyHold] = useState(false);

    const [flowData, setFlowData] = useFlowData();

    const [outPointerDrag, setOutPointerDrag] = useState(null);

    const [mouseClientX, setMouseClientX] = useState(null);
    const [mouseClientY, setMouseClientY] = useState(null);

    const [highlightNodeId, setHighlightNodeId] = useState(null);
    const [highlightItemId, setHighlightItemId] = useState(null);

    const [selectedElements, setSelectedElements] = useReducer(selectedElementsReducer, []);

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

                    if(isClientCoordInSelectedRect({x: event.clientX, y: event.clientY})) {

                        setFlowDragMode(DEFINITION.FlowActionMode.selected);
                        const selectedData = getSelectedItemInitData(selectedElements, flowData);
                        setCursorPositionBegin({
                            clientX: event.clientX,
                            clientY: event.clientY,
                            dragTarget: selectedData,
                        });

                    } else {

                        setFlowDragMode(DEFINITION.FlowActionMode.rect);
                        setCursorPositionBegin({
                            clientX: event.clientX,
                            clientY: event.clientY,
                            wasDrag: false,
                        });
    
                        setSelectedElements([]);

                    }

                }

                break;
            }
        
            case DEFINITION.MouseButtons.right: {

                
                // const imageElement = new NodeElement.nodeElementImage();
                // imageElement.method1();
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
    function handleMouseDownOnItem(event) {
        switch(event.buttons) {
            case DEFINITION.MouseButtons.left: {
                event.preventDefault();

                if(!spaceKeyHold && event.target.classList.contains('node-item')) {

                    event.stopPropagation();

                    if(event.shiftKey) {
                        const itemId = event.target.getAttribute("id");
                        const findItem = findNodeElement(itemId, DEFINITION.ElementType.item, flowData);
    
                        if(findItem) {
                            const newElements = updateSelectedElements(event.shiftKey, DEFINITION.ElementType.item, findItem.id);
                            
                            setFlowDragMode(DEFINITION.FlowActionMode.selected);
                            const selectedData = getSelectedItemInitData(newElements, flowData);
                            setCursorPositionBegin({
                                clientX: event.clientX,
                                clientY: event.clientY,
                                dragTarget: selectedData,
                            });
                        }
                    } else {

                        const itemId = event.target.getAttribute("id");
                        // item이 포함된 node가 drag 대상일 경우 무시.
                        const selectedElementIndex = selectedElements.findIndex((element) => {
                            return(element.id === itemId);
                        });

                        if(selectedElementIndex < 0) {
                            const findItem = findNodeElement(itemId, DEFINITION.ElementType.item, flowData);
        
                            if(findItem) {
                                setFlowDragMode(DEFINITION.FlowActionMode.selected);
        
                                const newElements = updateSelectedElements(event.shiftKey, DEFINITION.ElementType.item, findItem.id);
        
                                const selectedData = getSelectedItemInitData(newElements, flowData);
                                
                                setCursorPositionBegin({
                                    clientX: event.clientX,
                                    clientY: event.clientY,
                                    dragTarget: selectedData,
                                });
                            }
                        } else {
                            if(isClientCoordInSelectedRect({x: event.clientX, y: event.clientY})) {

                                setFlowDragMode(DEFINITION.FlowActionMode.selected);
                                const selectedData = getSelectedItemInitData(selectedElements, flowData);
                                setCursorPositionBegin({
                                    clientX: event.clientX,
                                    clientY: event.clientY,
                                    dragTarget: selectedData,
                                });
        
                            }
                        }
                    }
                }
                break;
            }
        
            case DEFINITION.MouseButtons.right: {
                event.preventDefault();
                event.stopPropagation();
                console.log("🚀 ~ onItem.right:");
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
    function handleMouseDownOnNode(event) {
        switch(event.buttons) {
            case DEFINITION.MouseButtons.left: {
                event.preventDefault();
                
                if(spaceKeyHold) {
                    initFlowDragMode(event);
                } else {

                    if(event.shiftKey) {
                        
                        let targetNode = getParentElement(event.target, 'flow-node');
                        const findNode = flowData.find((element) => { return(element.id === targetNode.getAttribute('id')) });
    
                        if(findNode) {
                            setFlowDragMode(DEFINITION.FlowActionMode.selected);
    
                            const newElements = updateSelectedElements(event.shiftKey, DEFINITION.ElementType.node, findNode.id);
    
                            const selectedData = getSelectedItemInitData(newElements, flowData);
    
                            setCursorPositionBegin({
                                clientX: event.clientX,
                                clientY: event.clientY,
                                dragTarget: selectedData,
                            });

                        }
                    } else {
                        if(isClientCoordInSelectedRect({x: event.clientX, y: event.clientY})) {

                            setFlowDragMode(DEFINITION.FlowActionMode.selected);
                            const selectedData = getSelectedItemInitData(selectedElements, flowData);
                            setCursorPositionBegin({
                                clientX: event.clientX,
                                clientY: event.clientY,
                                dragTarget: selectedData,
                            });
    
                        } else {
                            let targetNode = getParentElement(event.target, 'flow-node');
                            const findNode = flowData.find((element) => { return(element.id === targetNode.getAttribute('id')) });
        
                            if(findNode) {
                                setFlowDragMode(DEFINITION.FlowActionMode.selected);
        
                                const newElements = updateSelectedElements(event.shiftKey, DEFINITION.ElementType.node, findNode.id);
        
                                const selectedData = getSelectedItemInitData(newElements, flowData);
        
                                setCursorPositionBegin({
                                    clientX: event.clientX,
                                    clientY: event.clientY,
                                    dragTarget: selectedData,
                                });
        
                            }
                        }
                    }
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

        if (flowDragMode === DEFINITION.FlowActionMode.selected && selectedElements.length) {

            // client 좌표의 이동량을 flow 이동량으로 변환하고
            const dragDistance = convertClientDistanceToFlow(editorScaleLev, {
                x: cursorPositionBegin.clientX,
                y: cursorPositionBegin.clientY,
            }, {
                x: event.clientX,
                y: event.clientY,
            });

            // 선택된 항목을 모두 이동시킨다. 단,
            // element만 선택된 경우는 element를 이동 시키고,
            // element가 포함된 node가 선택되어 있으면 node를 이동시킨다.
            // node item은 node좌표에 대한 상대좌표를 사용하기 때문에 모두 이동시킬 경우 의도한 바라고 보기 어렵다.
            const copyFlowData = JSON.parse(JSON.stringify(flowData));
            const dragTarget = cursorPositionBegin.dragTarget;
            dragTarget.forEach((dragItem) => {
                if(dragItem.type === DEFINITION.ElementType.node) {

                    const findNode = copyFlowData.find((node) => {
                        return(node.id === dragItem.id);
                    });

                    if(copyFlowData) {
                        findNode.top  = Math.round((dragItem.top  + dragDistance.y) / DEFINITION.FLOW_GRID_SIZE) * DEFINITION.FLOW_GRID_SIZE;
                        findNode.left = Math.round((dragItem.left + dragDistance.x) / DEFINITION.FLOW_GRID_SIZE) * DEFINITION.FLOW_GRID_SIZE;
                    }
                } else {
                    const parentNode = findNodeByItemId(dragItem.id, flowData);
                    if(!parentNode) return;
                    
                    // item이 포함된 node가 drag 대상일 경우 무시.
                    const selectedElementIndex = selectedElements.findIndex((element) => {
                        return(element.id === parentNode.id);
                    });

                    // selectedElements에 node가 포함되어 있지 않을때만 좌표 수정
                    if(selectedElementIndex < 0) {
                        
                        const findNode = copyFlowData.find((node) => {
                            return(node.id === parentNode.id);
                        });

                        if(isEmptyArray(findNode.items)) return;
    
                        const findItem = findNode.items.find((item) => {
                            return(item.id === dragItem.id);
                        });

                        if(findItem) {
                            findItem.top  = dragItem.top  + dragDistance.y;
                            findItem.left = dragItem.left  + dragDistance.x;
                        }
                    }
                }
            });
            
            setFlowData(copyFlowData);
        } else if(flowDragMode === DEFINITION.FlowActionMode.flow) {
            const scaleOrigin = editorScaleLev / DEFINITION.FLOW_SCALE_LEVEL_RATE;

            const newTop  = (event.clientY - cursorPositionBegin.clientY) / scaleOrigin + cursorPositionBegin.flowTop;
            const newLeft = (event.clientX - cursorPositionBegin.clientX) / scaleOrigin + cursorPositionBegin.flowLeft;

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

            if(event.altKey) {
                setContainerPosition({
                    top: containerPosition.top,
                    left: containerPosition.left + DEFINITION.FLOW_GRID_SIZE * scaleVal,
                });
            } else {
                setContainerPosition({
                    top: containerPosition.top + DEFINITION.FLOW_GRID_SIZE * scaleVal,
                    left: containerPosition.left,
                });
            }

            setHighlightNodeId(null);
            setHighlightItemId(null);
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
        setCursorPositionBegin({clientX: 0, clientY: 0, dragTarget: []});
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

        setCursorPositionBegin({
            clientX: mouseEvent.clientX,
            clientY: mouseEvent.clientY,
            flowTop : containerPosition.top,
            flowLeft: containerPosition.left,
        });
    }



    /**
     * 
     */
    function isClientCoordInSelectedRect(clientCoord) {
        const rectResult = selectedItemRect({
            selectedElements : selectedElements,
            nodeData : flowData,
        });

        const flowCoord = convertClientCoordToFlow(editorScaleLev, props.boxRect, containerPosition, clientCoord);

        return(rectResult.selectedRect && isAPointInBRect(flowCoord, rectResult.selectedRect));
    }



    /**
     * 
     * @param  
     */
    function selectedElementsReducer(state, action) {
        if(JSON.stringify(state) === JSON.stringify(action)) return(state);
            else return(action);
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

        if(event.type === 'mouseover' && element !== null) {
            const nodeId = element.getAttribute("id");
            if(nodeId) setHighlightNodeId(nodeId);
        } else {
            setHighlightNodeId(null);
        }

    }



    /**
     * 
     * @param  
     */
    function updateHighlightItem(event) {

        if(event.type === 'mouseover' && event.target !== null) {
            const itemId = event.target.getAttribute("id");
            if(itemId) setHighlightItemId(itemId);
        } else {
            setHighlightItemId(null);
        }

    }



    /**
     * 
     * @param  
     */
    function updateSelectedElements(shiftKey, elementType, elementId, option = {}) {

        let newSelectedElements = null;

        if(shiftKey) {

            const findIndex = selectedElements.findIndex((element) => {
                return(element.id === elementId && element.type === elementType);
            });

            newSelectedElements = JSON.parse(JSON.stringify(selectedElements));

            if(option.forceAdd !== undefined) {
                if(option.forceAdd) {
                    if(findIndex < 0) {
                        newSelectedElements.push({
                            id: elementId,
                            type: elementType,
                        });
    
                        setSelectedElements(newSelectedElements);
                    }
                } else {
                    if(findIndex > -1) {
                        newSelectedElements.splice(findIndex, 1);
                        setSelectedElements(newSelectedElements);
                    }
                }
            } else {
                if(findIndex > -1) {
                    newSelectedElements.splice(findIndex, 1);
                } else {
                    newSelectedElements.push({
                        id: elementId,
                        type: elementType,
                    });
                }                
                setSelectedElements(newSelectedElements);
            }

        } else {

            newSelectedElements = [{
                id: elementId,
                type: elementType,
            }]

            setSelectedElements(newSelectedElements);
        }

        // TODO: update elementInterface


        return(newSelectedElements);
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

    useEffect(() => {

        return(() => {
            setFlowData(nodeData);
        });
    }, [setFlowData]);


    /**********************************************************************/
    // make html parts
    /**********************************************************************/
    const nodeHtml = flowData.map((node, index) => {

        node.right  = node.left + node.width;
        node.bottom = node.top + node.height;

        return(
            <Node 
                key={index} 
                width={node.width} 
                height={node.height} 
                node={node}
                containerPosition={containerPosition}

                onNodeMouseDown={handleMouseDownOnNode}
                onNodeMouseUp={handleMouseUpOnNode}

                onOutputPointerMouseDown={(event) => { PointerHandle.handleMouseDownOutput(event, flowData, containerPosition, setFlowDragMode, setOutPointerDrag); }}

                onInputPointerMouseEnter={PointerHandle.handleMouseEnterInput}
                onInputPointerMouseLeave={PointerHandle.handleMouseLeaveInput}

                onUpdateHighlightNode={updateHighlightNode}
                onUpdateHighlightItem={updateHighlightItem}

                onItemMouseDown={handleMouseDownOnItem}
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
        case DEFINITION.FlowActionMode.selected: {
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
                    cursorPositionBegin={cursorPositionBegin}
                    mouseClientX={mouseClientX}
                    mouseClientY={mouseClientY}
                    editorScaleLev={editorScaleLev}
                    boxRect={props.boxRect}
                    containerPosition={containerPosition}
                    flowDragMode={flowDragMode}
                    highlightNodeId={highlightNodeId}
                    highlightItemId={highlightItemId}
                    selectedElements={selectedElements}
                    updateSelectedElements={updateSelectedElements}
                />
            </div>


            <FlowScrollBar 
                type={DEFINITION.ScrollBarType.horizontal}
                containerPosition={containerPosition}
                boxRect={props.boxRect}
                editorScaleLev={editorScaleLev}
            />

            <FlowScrollBar 
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
                    userSelect: 'none',
                    pointerEvents: 'none',
                }}
            >
                <div style={{marginLeft: 20}}><span> Update log </span></div>
                <ol type="1">
                    <li>All selected element are moved by dragging</li>
                    <li>Add the feature to select items by dragging</li>
                    <li>Add 'item select with shiftKey'</li>
                    <li>Add 'item select' feature</li>
                    <li>Add item or node highlight</li>
                </ol>
            </div>
        </div>        
    )
}

  