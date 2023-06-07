import {DEFINITION} from '../definition'
import {selectedItemRect} from './control_function'

import ControlRect from './control_rect'
import ResizePoint from './reisze_point'

import {useFlowData} from '../../context_flow_data'

export default function SelectedElements(props) {
    const [flowData, ] = useFlowData();

    let selectedDivHtml = [];
    let controlRectHtml = [];
    let controlCornerPoint = [];

    const rectResult = selectedItemRect({
        selectedElements : props.selectedElements,
        nodeData : flowData,
    });

    
    if(rectResult.selectedRect) {
        let selectedItemType = props.selectedElements[0].type;
        props.selectedElements.forEach(element => {
            if(selectedItemType !== element.type) selectedItemType = null;
        });

        controlRectHtml.push(
            <ControlRect
                key={'top'}
                className={'top'}
                rectResult={rectResult}
                resize={selectedItemType}
                updateFlowDragMode={props.updateFlowDragMode}
            />
        );

        controlRectHtml.push(
            <ControlRect
                key={'left'}
                className={'left'}
                rectResult={rectResult}
                resize={selectedItemType}
                updateFlowDragMode={props.updateFlowDragMode}
            />
        );

        controlRectHtml.push(
            <ControlRect
                key={'right'}
                className={'right'}
                rectResult={rectResult}
                resize={selectedItemType}
                updateFlowDragMode={props.updateFlowDragMode}
            />
        );

        controlRectHtml.push(
            <ControlRect
                key={'bottom'}
                className={'bottom'}
                rectResult={rectResult}
                resize={selectedItemType}
                updateFlowDragMode={props.updateFlowDragMode}
            />
        );

        selectedDivHtml = rectResult.selectedElementsRectHtml;

        // node와 item은 사이즈 조정 방법이 다르기 때문에 섞여 있을 경우 리사이즈 노드를 만들지 않는다.
        if(selectedItemType === DEFINITION.ElementType.item) {
            controlCornerPoint.push(
                <ResizePoint 
                    key='nw'
                    className='nw'
                    rectResult={rectResult}
                    updateFlowDragMode={props.updateFlowDragMode}
                />
            );
    
            controlCornerPoint.push(
                <ResizePoint 
                    key='ne'
                    className='ne'
                    rectResult={rectResult}
                    updateFlowDragMode={props.updateFlowDragMode}
                />
            );
    
            controlCornerPoint.push(
                <ResizePoint 
                    key='se'
                    className='se'
                    rectResult={rectResult}
                    updateFlowDragMode={props.updateFlowDragMode}
                />
            );
    
            controlCornerPoint.push(
                <ResizePoint 
                    key='sw'
                    className='sw'
                    rectResult={rectResult}
                    updateFlowDragMode={props.updateFlowDragMode}
                />
            );
        }

    }

    return(<div>
        {controlRectHtml}
        {selectedDivHtml}
        {controlCornerPoint}
    </div>);
}