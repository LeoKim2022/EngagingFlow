export default function NodeItemRect(props) {
    
    return (
        <div 
            className="node-item-contents rect"

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