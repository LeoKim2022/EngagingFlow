export default function Connection(props) {

    let svgMargin = props.connectSvgMargin;

    return (
        <svg 
            className={`node-connect`}
            data-from-node={props.fromNode.id}
            data-from-item={props.fromItem.id}

            style={{
                top: props.pathInfo.svgRect.top - svgMargin,
                left: props.pathInfo.svgRect.left - svgMargin,
                width: props.pathInfo.svgRect.width + (svgMargin * 2),
                height: props.pathInfo.svgRect.height + (svgMargin * 2),
                // backgroundColor: "indigo"
            }}
        >
            <path 
                // d="
                //     M10 10
                //     L80 10
                //     L80 120
                //     L130 120
                // "
                stroke="#B0E0E6"
                strokeWidth="3px"
                fill="none"
            />
        </svg>
    )
}
