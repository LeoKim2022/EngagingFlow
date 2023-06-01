import { useEffect, useState } from 'react';

import {DEFINITION} from './definition'
import {compareObjectValue} from '../function/common'

export default function FlowScrollBar(props) {


    const nodeData          = props.nodeData;
    const containerPosition = props.containerPosition;
    const boxRect           = props.boxRect;
    const editorScaleLev    = props.editorScaleLev;
    const scrollType        = props.type;

    const scrollBarClass = Object.keys(DEFINITION.ScrollBarType).find((key) => DEFINITION.ScrollBarType[key] === scrollType);

    const [scrollDisplay, setScrollDisplay] = useState(false);
    const [scrollBarStatus, setScrollBarStatus] = useState({
        width: (scrollType === DEFINITION.ScrollBarType.horizontal) ? 0 : '100%',
        height: (scrollType === DEFINITION.ScrollBarType.horizontal) ? '100%' : 0,
        left: 0,
        top:  0,
    });

    useEffect(() => {
        if(boxRect.width > 0 && boxRect.height > 0) {
            let minAttrName;
            let maxAttrName;
            let edge;
        
            if(scrollType === DEFINITION.ScrollBarType.vertical) {
                minAttrName = 'top';
                maxAttrName  = 'bottom';
                edge = "height";
            } else {
                minAttrName = 'left';
                maxAttrName = 'right';
                edge = "width";
            }
        
            let minNodeLoc = Number.MAX_SAFE_INTEGER;
            // let minNodeId = null;
            let maxNodeLoc = Number.MIN_SAFE_INTEGER;
            // let maxNodeId = null;
        
            nodeData.forEach((element) => {
                const minValue = element[minAttrName]; 
                if(minNodeLoc > minValue) {
                    // minNodeId = element.id;
                    minNodeLoc = minValue;
                }
                
                const maxValue = element[maxAttrName];
                if(maxNodeLoc < maxValue) {
                    // maxNodeId = element.id;
                    maxNodeLoc = maxValue;
                }
            });
    
            const scaleOrigin = editorScaleLev / DEFINITION.FLOW_SCALE_LEVEL_RATE;
        
            let minPos = (containerPosition[minAttrName] * scaleOrigin) + (minNodeLoc * scaleOrigin);
            let maxPos = (containerPosition[minAttrName] * scaleOrigin) + (maxNodeLoc * scaleOrigin);
            
            if(minPos < 0 || boxRect[edge] < maxPos) {
                const trackRect = {
                    from: 0,
                    end : boxRect[edge],
                }
    
                const barRect = {
                    from: 0,
                    end : boxRect[edge],
                }
    
                const copyStatus = JSON.parse(JSON.stringify(scrollBarStatus));
    
                if(minPos < 0) {
                    minPos *= -1;
                    trackRect.end += minPos;
                    barRect.from += minPos;
                    barRect.end += minPos;
                } 
    
                if(maxPos > boxRect[edge]) {
                    trackRect.end += maxPos - boxRect[edge];
                    barRect.end -= (maxPos - boxRect[edge]);
                }

                
                copyStatus[edge] = (barRect.end - barRect.from) / trackRect.end * boxRect[edge];
                copyStatus[minAttrName] = barRect.from / trackRect.end * boxRect[edge];

                if(!compareObjectValue(copyStatus, scrollBarStatus)) {
                    setScrollBarStatus(copyStatus);
                }
                
                setScrollDisplay(true);
            } else {
                setScrollDisplay(false);
            }
        }
    }, [nodeData, containerPosition, boxRect, editorScaleLev, scrollType, scrollDisplay, scrollBarStatus]);
    
    return (
        <div 
            className={`flow-scroll-track ${scrollBarClass}`}
            style={{display: scrollDisplay? 'block': 'none'}}
        >
            <div 
                className='flow-scroll-bar'
                style={{
                    width : scrollBarStatus.width,
                    height: scrollBarStatus.height,
                    left  : scrollBarStatus.left,
                    top   : scrollBarStatus.top,
                }}
            />
        </div>
    );
}