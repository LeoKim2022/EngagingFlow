import {DEFINITION} from '../definition'

export default function ControlRect(props) {

    const controlRectStyle = JSON.parse(JSON.stringify(props.style));
    controlRectStyle.padding = DEFINITION.CONTROL_RECT_BORDER_MARGIN;

    return(
        <div
            className={`flow-control-rect ${props.className}`}
            
            style={{
                top: controlRectStyle.top,
                left: controlRectStyle.left,
                padding: controlRectStyle.padding,
            }}

            onMouseOver={(event) => {

            }}
        >
            <div
                style={{
                    width: controlRectStyle.width,
                    height: controlRectStyle.height,
                }}
            />
        </div>
    )
}
