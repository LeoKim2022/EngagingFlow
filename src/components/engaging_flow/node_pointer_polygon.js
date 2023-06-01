import {DEFINITION} from './definition'

function nodePointerPentagon() {
    const width   = DEFINITION.NodePointerSize.width
    const height  = DEFINITION.NodePointerSize.height
    const rectPos = 0.6
    
    return(`
        1,1 
        ${(width - 1) * rectPos},1 
        ${width - 1},${(height - 1) / 2} 
        ${(width - 1) * rectPos},${height - 1} 
        1,${height - 1}
    `)
}



function nodePointerTriangle(edge, point) {

    let pointsVal;

    let width  = DEFINITION.ItemPointerSize.width;
    let height = DEFINITION.ItemPointerSize.height;

    switch(edge) {
        case 'top': {

            pointsVal = `
                ${point.x - width/2}, ${point.y} 
                ${point.x}, ${point.y - height}
                ${point.x + width/2}, ${point.y} 
            `;
            break;
        }
    
        case 'bottom': {

            pointsVal = `
                ${point.x - width/2}, ${point.y} 
                ${point.x}, ${point.y + height}
                ${point.x + width/2}, ${point.y} 
            `;
            break;
        }
    
        default: {
            width  = DEFINITION.ItemPointerSize.height;
            height = DEFINITION.ItemPointerSize.width;

            pointsVal = `
                ${point.x}, ${point.y - height/2} 
                ${point.x + width}, ${point.y}
                ${point.x}, ${point.y + height/2} 
                `;
            break;
        }
    }
    
    return(pointsVal)
}

export {nodePointerPentagon, nodePointerTriangle}