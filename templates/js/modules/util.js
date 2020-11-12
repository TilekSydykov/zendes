export class NodeTitle {
    width = 0;
    x = 0;
    y = 0;
    txt;
    constructor(x, y, width, text) {
        this.width = width;
        this.x = x;
        this.y = y;
        this.txt = text;
    }
}

export class NodePoint {
    x = 0;
    y = 0;
    r = 3.7;
    type = '';

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}

export class LineData{
    id;
    nodeOneIndex;
    pointOneIndex;
    nodeTwoIndex;
    pointTwoIndex;
    constructor(nodeOneIndex, pointOneIndex, nodeTwoIndex, pointTwoIndex,) {
        this.id = `${nodeOneIndex}:${pointOneIndex}:${nodeTwoIndex}:${pointTwoIndex}`;
        this.nodeOneIndex = nodeOneIndex;
        this.pointOneIndex = pointOneIndex;
        this.nodeTwoIndex = nodeTwoIndex;
        this.pointTwoIndex = pointTwoIndex;
    }
}
