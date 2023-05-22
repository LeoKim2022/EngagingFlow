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

// TODO: nodePointerTriangle
function nodePointerTriangle(params) {

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

export {nodePointerPentagon, nodePointerTriangle}