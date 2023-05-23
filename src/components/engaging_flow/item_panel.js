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
        >
        </div>
    );
}