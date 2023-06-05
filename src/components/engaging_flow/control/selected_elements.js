import {DEFINITION} from '../definition'
import {selectedItemRect} from './control_function'

import ControlRect from './control_rect'

import {useFlowData} from '../../context_flow_data'

export default function SelectedElements(props) {
    const [flowData, ] = useFlowData();

    let selectedDivHtml = [];
    let controlRectHtml = [];

    const rectResult = selectedItemRect({
        selectedElements : props.selectedElements,
        nodeData : flowData,
    });

    if(rectResult.selectedRect) {

        controlRectHtml.push(
            <ControlRect
                key={'top'}
                style={{
                    top: rectResult.selectedRect.top - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    left: rectResult.selectedRect.left - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    width: rectResult.selectedRect.width,
                    height: DEFINITION.CONTROL_RECT_BORDER_WIDTH,
                }}
                className={'top'}
            />
        );

        controlRectHtml.push(
            <ControlRect
                key={'left'}
                style={{
                    top: rectResult.selectedRect.top - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    left: rectResult.selectedRect.left - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    width: DEFINITION.CONTROL_RECT_BORDER_WIDTH,
                    height: rectResult.selectedRect.height,
                }}
                className={'left'}
            />
        );

        controlRectHtml.push(
            <ControlRect
                key={'right'}
                style={{
                    top: rectResult.selectedRect.top - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    left: rectResult.selectedRect.right - DEFINITION.CONTROL_RECT_BORDER_WIDTH - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    width: DEFINITION.CONTROL_RECT_BORDER_WIDTH,
                    height: rectResult.selectedRect.height,
                }}
                className={'right'}
            />
        );

        controlRectHtml.push(
            <ControlRect
                key={'bottom'}
                style={{
                    top: rectResult.selectedRect.bottom - DEFINITION.CONTROL_RECT_BORDER_WIDTH - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    left: rectResult.selectedRect.left - DEFINITION.CONTROL_RECT_BORDER_MARGIN,
                    width: rectResult.selectedRect.width,
                    height: DEFINITION.CONTROL_RECT_BORDER_WIDTH,
                }}
                className={'bottom'}
            />
        );

        selectedDivHtml = rectResult.selectedElementsRectHtml;
    }

    return(<div>
        {controlRectHtml}
        {selectedDivHtml}
    </div>);
}