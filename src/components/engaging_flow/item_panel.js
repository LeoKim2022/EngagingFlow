// import {getParentElement} from './flow_function'

export default function ItemPanel(props) {
    const item = props.item;
    
    return (
        <div 
            className="item-panel" 
            id={item.id}
            style={{
                top: item.top, 
                left: item.left, 
                width: item.width, 
                height: item.height
            }}

            onMouseOver={(event) => {
                if(event.target.classList.contains('item-panel')) {
                    props.onUpdateHighlightItem(event, event.target);
                }
            }}

            onMouseOut={(event) => {
                if(event.target.classList.contains('item-panel')) {
                    props.onUpdateHighlightItem(event, event.target);
                }
            }}
        >
        </div>
    );
}