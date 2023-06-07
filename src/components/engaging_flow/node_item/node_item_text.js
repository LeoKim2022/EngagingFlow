export default function NodeItemText(props) {
    
    return (
        <p 
            className="node-item-contents text"

            onMouseOver={(event) => {
                // props.onUpdateHighlightItem(event);
            }}

            onMouseOut={(event) => {
                // props.onUpdateHighlightItem(event);
            }}

            onMouseDown={(event) => {
                props.onItemMouseDown(event);
            }}        
        >
            {props.item.text}
        </p>
    );
}