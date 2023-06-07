export default function NodeItemImage(props) {
    
    return (
        <img 
            className="node-item-contents image" 
            src={props.item.src} 
            alt="test_img_1" 
            style={{objectFit: props.item.objectFit}}


            onMouseOver={(event) => {
                props.onUpdateHighlightItem(event);
            }}

            onMouseOut={(event) => {
                props.onUpdateHighlightItem(event);
            }}

            onMouseDown={(event) => {
                props.onItemMouseDown(event);
            }}
        />
    );
}