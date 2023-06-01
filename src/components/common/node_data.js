const nodeWidth  = 180
const nodeHeight = nodeWidth * 1.6

const nodeData = [
    {
        id: 'aaa',
        top: 40,
        left: 40,
        width: nodeWidth,
        height: nodeHeight,
        items: [
            {
                id: "a1",
                top: -5,
                left: -5,
                width: 50,
                height: 30,
            },
            {
                id: "b3",
                top: 80,
                left: 30,
                width: 20,
                height: 30,
                action: {
                    id: "eee",
                }
            },
        ],
        // action: {
        //     id: "bbb",
        // }
    },
    {
        id: 'bbb',
        top: 40,
        left: 320,
        width: nodeWidth,
        height: nodeHeight,
        items: [
        ]
    },
    {
        id: 'ccc',
        top: 40,
        left: 920,
        width: nodeWidth,
        height: nodeHeight,
        items: [
            {
                id: "c1",
                top: 40,
                left: 40,
                width: 50,
                height: 50,
            },
        ]
    },
    {
        id: 'ddd',
        top: 360,
        left: 920,
        width: nodeWidth,
        height: nodeHeight,
        items: [
            {
                id: "d1",
                top: 10,
                left: 20,
                width: 50,
                height: 50,
            },
            {
                id: "d2",
                top: 80,
                left: 30,
                width: 50,
                height: 50,
            },
        ]
    },
    {
        id: 'eee',
        top: 400,
        left: 120,
        width: nodeWidth,
        height: nodeHeight,
        items: [
            {
                id: "e1",
                top: 10,
                left: 10,
                width: 20,
                height: 20,
            },
            {
                top: 10,
                left: 40,
                width: 15,
                height: 15,
            },
            {
                top: 10,
                left: 65,
                width: 20,
                height: 15,
            },
            {
                id: "e4",
                top: 40,
                left: 10,
                width: 25,
                height: 25,
                action: {
                    id: "ccc",
                }
            },
            {
                top: 40,
                left: 70,
                width: 20,
                height: 20,
            },
            {
                top: 110,
                left: 10,
                width: 15,
                height: 15,
            },
            {
                top: 110,
                left: 40,
                width: 20,
                height: 20,
            },
            {
                top: 110,
                left: 70,
                width: 13,
                height: 13,
            },
        ],
        // action: {
        //     id: "bbb",
        // }
    },
    {
        id: 'fff',
        top: 400,
        left: 480,
        width: nodeWidth,
        height: nodeHeight,
        items: [
            {
                id: "ff1",
                top: 40,
                left: 40,
                width: 50,
                height: 50,
                action: {
                    id: "hhh",
                }
            },
        ]
    },
    {
        id: 'ggg',
        top: 720,
        left: 40,
        width: nodeWidth,
        height: nodeHeight,
        items: [
            {
                id: "g1",
                top: 10,
                left: 20,
                width: 50,
                height: 50,
                action: {
                    id: "hhh",
                }
            },
            {
                top: 80,
                left: 30,
                width: 50,
                height: 50,
            },
        ]
    },
    {
        id: 'hhh',
        top: 720,
        left: 480,
        width: nodeWidth,
        height: nodeHeight,
        items: [
            {
                top: 10,
                left: 10,
                width: 50,
                height: 50,
            },
            {
                top: 100,
                left: 30,
                width: 50,
                height: 50,
            },
        ]
    },
    {
        id: 'iii',
        top: 720,
        left: 720,
        width: nodeWidth,
        height: nodeHeight,
        items: [
            {
                top: 40,
                left: 40,
                width: 50,
                height: 50,
            },
        ]
    },
]

export {nodeData}