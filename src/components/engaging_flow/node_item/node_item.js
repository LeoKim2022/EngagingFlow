import './node_item.css';

import {DEFINITION} from '../definition'

// Component
import NodeItemText  from './node_item_text'
import NodeItemImage from './node_item_image'
import NodeItemRect  from './node_item_rect'

export default function NodeItem(props) {
    const item = props.item;

    let childItemJsx  = null;
    let nodeItemClass = '';

    switch(item.type) {
        case DEFINITION.NodeItemType.text: {
            nodeItemClass = 'text';
            childItemJsx = <NodeItemText 
                item={props.item}
                onItemMouseDown={props.onItemMouseDown}
            />;
            break;
        }
    
        case DEFINITION.NodeItemType.image: {
            nodeItemClass = 'image';
            childItemJsx = <NodeItemImage 
                item={props.item}
                onUpdateHighlightItem={props.onUpdateHighlightItem}
                onItemMouseDown={props.onItemMouseDown}
            />;
            break;
        }
    
        case DEFINITION.NodeItemType.rect: {
            nodeItemClass = 'rect';
            childItemJsx = <NodeItemRect 
                item={props.item}
                onUpdateHighlightItem={props.onUpdateHighlightItem}
                onItemMouseDown={props.onItemMouseDown}
            />;
            break;
        }
    
        default: {
            break;
        }
    }
    
    return (
        <div 
            className={`node-item ${nodeItemClass}`}
            id={item.id}
            style={{
                top: item.top, 
                left: item.left, 
                width: item.width, 
                height: item.height
            }}
        >
            {childItemJsx}
        </div>
    );
}