class nodeElement {

    constructor() {
        this.top = 0;
        this.left = 0;
        this.right = 0;
        this.bottom = 0;

        this.width = 0;
        this.height = 0;
        this.type = null;
    }

    method1() {
        console.log("🚀 ~ call method1");
    }
}

class nodeElementText extends nodeElement {
    constructor() {
        super(); 
        this.text = '';
        this.color = '';
        this.fontSize = '';
    }
}

class nodeElementImage extends nodeElement {
    constructor() {
        super();
        this.source = '';
        this.imageWidth = '';
        this.imageHeight = '';
        this.opacity = 1;
    }
}

class nodeElementRect extends nodeElement {
    constructor() {
        super();
        this.color = '';
        this.opacity = 1;
    }
}

export {
    nodeElementText,
    nodeElementImage,
    nodeElementRect,
}