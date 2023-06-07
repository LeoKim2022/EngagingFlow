import { useEffect } from 'react';
import { isARectInBRect, isEmptyArray } from '../../function/common';
import {DEFINITION} from '../definition'

import './control.css'

import SelectedElements from './selected_elements'

import {useFlowData} from '../../context_flow_data'

export default function ControlBox(props) {
    const [flowData, ] = useFlowData();

    const updateSelectedElements = props.updateSelectedElements;

    let controlDragStyle = null;
    let highLightItemStyle = null;

    if(props.flowDragMode === DEFINITION.FlowActionMode.rect && props.mouseClientY !== null && props.mouseClientX !== null) {

        const scaleValueOrigin = props.editorScaleLev / 10;
        const rectTop    = Math.min(props.cursorPositionBegin.clientY, props.mouseClientY);
        const rectLeft   = Math.min(props.cursorPositionBegin.clientX, props.mouseClientX);
        const rectRight  = Math.max(props.cursorPositionBegin.clientX, props.mouseClientX);
        const rectBottom = Math.max(props.cursorPositionBegin.clientY, props.mouseClientY);
    
        controlDragStyle = {
            top: (rectTop - props.boxRect.top) / scaleValueOrigin - props.containerPosition.top,
            left: (rectLeft - props.boxRect.left) / scaleValueOrigin - props.containerPosition.left,
            width: (rectRight - rectLeft) / scaleValueOrigin,
            height: (rectBottom - rectTop) / scaleValueOrigin,
        }

        controlDragStyle.right = controlDragStyle.left + controlDragStyle.width;
        controlDragStyle.bottom = controlDragStyle.top + controlDragStyle.height;
        
    } else {

        if(props.highlightItemId) {

            const selectedItemIndex = props.selectedElements.findIndex((item) => {
                return(item.id === props.highlightItemId && item.type === DEFINITION.ElementType.item);
            });

            if(selectedItemIndex < 0) {
                let targetItem = null;
                const targetNode = flowData.find((node) => {
                    if(Array.isArray(node.items)) {
                        targetItem = node.items.find((item) => {
                            return(item.id === props.highlightItemId);
                        });
    
                        if(targetItem) return(true);
                            else return(false);
                    }
    
                    return(false);
                });
                
                if(targetNode && targetItem) {
                    highLightItemStyle = {
                        top   : targetNode.top + targetItem.top + DEFINITION.ITEM_BORDER_WIDTH,
                        left  : targetNode.left + targetItem.left + DEFINITION.ITEM_BORDER_WIDTH,
                        width : targetItem.width + DEFINITION.ITEM_BORDER_WIDTH,
                        height: targetItem.height + DEFINITION.ITEM_BORDER_WIDTH,
                    }
                }
            }

        } else if(props.highlightNodeId) {

            const selectedNodeIndex = props.selectedElements.findIndex((item) => {
                return(item.id === props.highlightNodeId && item.type === DEFINITION.ElementType.node);
            });

            if(selectedNodeIndex < 0) {
                const targetNode = flowData.find((node) => {
                    return(node.id === props.highlightNodeId);
                });
                
                if(targetNode) {
                    highLightItemStyle = {                    
                        top   : targetNode.top,
                        left  : targetNode.left,
                        width : targetNode.width,
                        height: targetNode.height,
                    }
                }
            }

        }        
    }

    useEffect(() => {
        if(!controlDragStyle) return;

        // Engaging flow 특성상 완전히 포함되는 element만 선택하도록 조정합니다.
        // 조금이라도 겹치는 영역으로 선택하게 되면, element만 선택하기 더 어렵습니다. 
        for(let index = 0, limit = flowData.length; index < limit; ++index) {

            const node = flowData[index];

            if(isARectInBRect(node, controlDragStyle)) {
                updateSelectedElements(true, DEFINITION.ElementType.node, node.id, {forceAdd: true});
            } else {
                updateSelectedElements(true, DEFINITION.ElementType.node, node.id, {forceAdd: false});
            }

            if(!isEmptyArray(node.items)) {
                for(let itemIndex = 0, itemLimit = node.items.length; itemIndex < itemLimit; ++itemIndex) {

                    const item = node.items[itemIndex];
                    if(!item.id) continue;

                    const itemPositionFromFlow = {
                        top: node.top + item.top,
                        left: node.left + item.left,
                        right: node.left + item.right,
                        bottom: node.top + item.bottom,
                    }

                    if(isARectInBRect(itemPositionFromFlow, controlDragStyle)) {
                        updateSelectedElements(true, DEFINITION.ElementType.item, item.id, {forceAdd: true});
                    } else {
                        updateSelectedElements(true, DEFINITION.ElementType.item, item.id, {forceAdd: false});
                    }

                }
            }

        }
    }, [controlDragStyle, flowData, updateSelectedElements]);

    return(
        <div 
            className="flow-control-box"
            style={{
                top: props.containerPosition.top, 
                left: props.containerPosition.left,
            }}
        >
            {
                (controlDragStyle) ? <div 
                    className='control-rect-drag'
                    style={controlDragStyle}
                /> : null
            }

            {
                (highLightItemStyle) ? <div 
                    className='flow-highlight-item'
                    style={highLightItemStyle}
                /> : null
            }

            <SelectedElements selectedElements={props.selectedElements}/>

        </div>
    )
}