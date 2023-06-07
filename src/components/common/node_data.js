import {DEFINITION} from '../engaging_flow/definition'

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
                id: 'a1',
                type: DEFINITION.NodeItemType.text,
                text: 'Text1',

                top: 10,
                left: 10,
                width: 60,
                height: 40,
            },
            {
                id: 'b3',
                type: DEFINITION.NodeItemType.rect,
                top: 80,
                left: 90,
                width: 20,
                height: 30,
                action: {
                    id: 'eee',
                }
            },
        ],
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
                id: 'c1',
                type: DEFINITION.NodeItemType.image,
                src: 'https://cdn.engaging.co/landing/CHOY7SV/file/3/imvsz9uJvhBSzzoABnBsr6niPSoVBdjc.png',
                objectFit: 'fill',
                top: 10,
                left: 10,
                width: 120,
                height: 120,
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
                id: 'd1',
                type: DEFINITION.NodeItemType.rect,
                top: 10,
                left: 20,
                width: 50,
                height: 50,
            },
            {
                id: 'd2',
                type: DEFINITION.NodeItemType.rect,
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
                id: 'e1',
                type: DEFINITION.NodeItemType.rect,
                top: 10,
                left: 10,
                width: 20,
                height: 20,
            },
            {
                id: 'e2',
                type: DEFINITION.NodeItemType.rect,
                top: 10,
                left: 40,
                width: 15,
                height: 15,
            },
            {
                id: 'e3',
                type: DEFINITION.NodeItemType.rect,
                top: 10,
                left: 60,
                width: 20,
                height: 15,
            },
            {
                id: 'e4',
                type: DEFINITION.NodeItemType.rect,
                top: 40,
                left: 10,
                width: 25,
                height: 25,
                action: {
                    id: 'ccc',
                }
            },
            {
                id: 'e5',
                type: DEFINITION.NodeItemType.rect,
                top: 40,
                left: 70,
                width: 20,
                height: 20,
            },
            {
                id: 'e6',
                type: DEFINITION.NodeItemType.rect,
                top: 110,
                left: 10,
                width: 15,
                height: 15,
            },
            {
                id: 'e7',
                type: DEFINITION.NodeItemType.rect,
                top: 110,
                left: 40,
                width: 20,
                height: 20,
            },
            {
                id: 'e8',
                type: DEFINITION.NodeItemType.rect,
                top: 110,
                left: 70,
                width: 13,
                height: 13,
            },
        ],
        // action: {
        //     id: 'bbb',
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
                id: 'ff1',
                type: DEFINITION.NodeItemType.rect,
                top: 40,
                left: 40,
                width: 50,
                height: 50,
                action: {
                    id: 'hhh',
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
                id: 'g1',
                type: DEFINITION.NodeItemType.rect,
                top: 10,
                left: 20,
                width: 50,
                height: 50,
                action: {
                    id: 'hhh',
                }
            },
            {
                id: 'g2',
                type: DEFINITION.NodeItemType.rect,
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
                id: 'h1',
                type: DEFINITION.NodeItemType.rect,
                top: 10,
                left: 10,
                width: 50,
                height: 50,
            },
            {
                id: 'h2',
                type: DEFINITION.NodeItemType.rect,
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
                id: 'i1',
                type: DEFINITION.NodeItemType.rect,
                top: 40,
                left: 40,
                width: 50,
                height: 50,
            },
        ]
    },
]

export {nodeData}