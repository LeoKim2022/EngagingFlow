export default function Connection(props) {

    return (
        <svg 
            className={`node-connect`}
            data-from-node={props.fromNode.id}
            data-from-item={props.fromItem.id}

            style={{
                top: props.pathPointer.svgRect.top,
                left: props.pathPointer.svgRect.left,
                width: props.pathPointer.svgRect.width,
                height: props.pathPointer.svgRect.height,
                backgroundColor: "indigo"
            }}
        >
            {/* <polygon
                points={``}
            /> */}
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
