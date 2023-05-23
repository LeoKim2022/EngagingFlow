function nodePointerPentagon(params) {
    const width   = params.width
    const height  = params.height
    const rectPos = 0.6
    
    return(`
        1,1 
        ${(width - 1) * rectPos},1 
        ${width - 1},${(height - 1) / 2} 
        ${(width - 1) * rectPos},${height - 1} 
        1,${height - 1}
    `)
}



function nodePointerTriangle(edge, point, itemPointerSize) {

    let pointsVal;

    let width  = itemPointerSize.width;
    let height = itemPointerSize.height;

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
            width  = itemPointerSize.height;
            height = itemPointerSize.width;

            pointsVal = `
                ${point.x + 1}, ${point.y - height/2} 
                ${point.x + 1 + width}, ${point.y}
                ${point.x + 1}, ${point.y + height/2} 
                `;
            break;
        }
    }
    
    return(pointsVal)
}

export {nodePointerPentagon, nodePointerTriangle}