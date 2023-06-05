// import {getParentElement} from './flow_function'

export default function ItemPanel(props) {
    const item = props.item;
    
    return (
        <div 
            className="node-item" 
            id={item.id}
            style={{
                top: item.top, 
                left: item.left, 
                width: item.width, 
                height: item.height
            }}

            onMouseOver={(event) => {
                if(event.target.classList.contains('node-item')) {
                    props.onUpdateHighlightItem(event);
                }
            }}

            onMouseOut={(event) => {
                if(event.target.classList.contains('node-item')) {
                    props.onUpdateHighlightItem(event);
                }
            }}

            onMouseDown={(event) => {
                if(event.target.classList.contains('node-item')) {
                    props.onItemMouseDown(event);
                }
            }}
        >
        </div>
    );
}