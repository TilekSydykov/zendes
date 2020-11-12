import {Node} from "./node.js";
import {LineData} from "./util.js";

class Point {
    x = 0;y = 0;
    constructor(x, y) {this.x = x;this.y = y;}
    up(px){this.x-= px;}
    down(px){this.x += px;}
    left(px){this.y-=px}
    right(px){this.y+=px}
}

export class Const {
    static pointInputType = 'i';
    static pointOutputType = 'o';
}

export class Canvas {
    canvas;
    context;
    height;
    width;
    scale = 15;

    selectedNodeInfo = {
        id: -1,
        dy: 0,
        dx: 0
    };

    entireMoveInfo = {
        isEnabled: false,
        ly: 0,
        lx: 0
    };

    selectedPointInfo = {
        point: null,
        nodeIndex: -1,
        pointIndex: -1
    };

    nodes = [];
    lines = [];

    editNodeListener;

    constructor(containerId) {
        this.canvas = document.getElementById(containerId);
        this.context = this.canvas.getContext('2d');

    }

    init(){
        this.canvas.addEventListener("wheel", e=>{this.wheelListener(e)}, false);

        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

    }

    resize(){
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.update()
    }

    addNode(node) {
        this.nodes.push(node);
        this.update();
    }

    addNodeWithDrag(node){
        this.nodes.push(node);
        this.update();

        let n = this.nodes;
        let id = n.length-1;
        this.selectedNodeInfo = {
            id : id,
            dy: n[id].height / 2,
            dx: n[id].width / 2
        };
    }

    update() {
        this.canvas.width = this.width;
        let node;
        let x;
        let y;
        for (let i = 0; i < this.nodes.length; i++) {
            node = this.nodes[i];
            if (node.x + node.width > 0 || node.y + node.height > 0 || node.x < this.width || node.y < this.height){
                node.draw(this.context)
            }
        }
        let line;
        this.context.strokeStyle = '#000000';
        for (let i = 0; i < this.lines.length; i++){
            line = this.lines[i];
            this.context.beginPath();
            x = this.nodes[line.nodeOneIndex].x + this.nodes[line.nodeOneIndex].points[line.pointOneIndex].x;
            y = this.nodes[line.nodeOneIndex].y + this.nodes[line.nodeOneIndex].points[line.pointOneIndex].y;
            this.context.moveTo(x, y);
            x = this.nodes[line.nodeTwoIndex].x + this.nodes[line.nodeTwoIndex].points[line.pointTwoIndex].x;
            y = this.nodes[line.nodeTwoIndex].y + this.nodes[line.nodeTwoIndex].points[line.pointTwoIndex].y;
            this.context.lineTo(x, y);
            this.context.stroke();
        }
    }

    selectNode(event) {
        let pos = this.getMousePos(this.canvas, event);
        let length = this.nodes.length;
        for (let i = 0; i < length; i++) {
            if (this.nodes[i].isSelected(pos.x , pos.y)) {
                this.selectedNodeInfo.id = i;
                this.selectedNodeInfo.dx = pos.x - this.nodes[i].x;
                this.selectedNodeInfo.dy = pos.y - this.nodes[i].y;
                return
            }

            if (this.nodes[i].isInBounds(pos.x , pos.y)){

                let pointInfo = this.nodes[i].isPointSelected(pos.x , pos.y);
                if (pointInfo !== null){
                    if (pointInfo.item.type === Const.pointInputType){
                        let line = this.findLineWithInputPoint(pointInfo.i, i);
                        if (line !== -1){
                            this.selectedPointInfo.point =
                                this.nodes[this.lines[line].nodeOneIndex].points[this.lines[line].pointOneIndex];

                            this.selectedPointInfo.nodeIndex = this.lines[line].nodeOneIndex;
                            this.selectedPointInfo.pointIndex = this.lines[line].pointOneIndex;

                            this.lines.splice(line, 1);
                            return;
                        }
                        this.selectedPointInfo.point = pointInfo.item;
                        this.selectedPointInfo.nodeIndex = i;
                        this.selectedPointInfo.pointIndex = pointInfo.i;
                    }else{
                        this.selectedPointInfo.point = pointInfo.item;
                        this.selectedPointInfo.nodeIndex = i;
                        this.selectedPointInfo.pointIndex = pointInfo.i;
                    }
                    return;
                }
                if (this.nodes[i].isEditSelected(pos.x, pos.y)){
                    this.editNodeListener(this.nodes[i], pos);
                    return
                }
            }
        }
    }


    getMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: Math.floor(evt.clientX - rect.left),
            y: evt.clientY - rect.top
        };
    }

    moveSelectedNode(e) {
        let pos = this.getMousePos(this.canvas, e);

        if (this.entireMoveInfo.isEnabled){
            let dx = this.entireMoveInfo.lx - e.screenX;
            let dy = this.entireMoveInfo.ly - e.screenY;

            this.entireMoveInfo.lx = e.screenX;
            this.entireMoveInfo.ly = e.screenY;
            this.nodes.forEach(i => {
                i.moveX(dx);
                i.moveY(dy);
            });
            this.update();
            return
        }

        if (this.selectedNodeInfo.id !== -1) {
            this.nodes[this.selectedNodeInfo.id].moveTo(
                pos.x - this.selectedNodeInfo.dx,
                pos.y - this.selectedNodeInfo.dy);
            this.update();
        }

        if (this.selectedPointInfo.point !== null){
            this.update();
            this.context.beginPath();
            this.context.strokeStyle = '#191919';
            this.context.moveTo(
                this.selectedPointInfo.point.x + this.nodes[this.selectedPointInfo.nodeIndex].x,
                this.selectedPointInfo.point.y + this.nodes[this.selectedPointInfo.nodeIndex].y);
            this.context.lineTo(pos.x, pos.y);
            this.context.stroke();
        }
    }

    entireMove(e){
        this.entireMoveInfo.isEnabled = true;
        this.entireMoveInfo.lx = e.screenX;
        this.entireMoveInfo.ly = e.screenY;
    }

    deselectNode(e) {
        let pos = this.getMousePos(this.canvas, e);

        this.entireMoveInfo.isEnabled = false;
        this.selectedNodeInfo.id = -1;

        if (this.selectedPointInfo.point !== null){
            for (let i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].isInBounds(pos.x , pos.y)){
                    let pointInfo = this.nodes[i].isPointSelected(pos.x , pos.y);
                    if (pointInfo !== null &&
                        this.selectedPointInfo.nodeIndex !== i &&
                        this.selectedPointInfo.point.type !== pointInfo.item.type){
                        let line;
                        if (this.selectedPointInfo.point.type === Const.pointOutputType){
                            // first point OUTPUT second is INPUT
                            let line = this.findLineWithInputPoint(pointInfo.i, i);
                            if (line !== -1){
                                this.selectedPointInfo.point = null;
                                this.update();
                                return;
                            }
                            line = new LineData(
                                this.selectedPointInfo.nodeIndex,
                                this.selectedPointInfo.pointIndex,
                                i, pointInfo.i
                            );
                            this.addLineIfDoesNotExist(line)
                        }else{
                            // fist point INPUT second is OUTPUT
                            let line = this.findLineWithInputPoint(
                                this.selectedPointInfo.nodeIndex,
                                this.selectedPointInfo.pointIndex);
                            if (line !== -1){
                                this.selectedPointInfo.point = null;
                                this.update();
                                return;
                            }
                            line = new LineData(
                                i, pointInfo.i,
                                this.selectedPointInfo.nodeIndex,
                                this.selectedPointInfo.pointIndex
                            );
                            this.addLineIfDoesNotExist(line)
                        }

                    }
                }
            }
            this.selectedPointInfo.point = null;
            this.update();
        }
        this.selectedPointInfo.point = null;
    }

    wheelListener(e) {
        e.preventDefault();
        if(e.deltaY > 0){
            this.scale++;
        }else{
            this.scale--;
        }
        this.update();
    }

    addLineIfDoesNotExist(line){
        let exist = false;
        for (let j = 0; j < this.lines.length; j++) {
            if (this.lines[j].id === line.id){
                exist = true;
                break;
            }
        }
        if (!exist){
            this.lines.push(line);
        }
        this.selectedPointInfo.point = null;
    }

    findLineWithInputPoint(pointIndex, pointNodeIndex){
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].pointTwoIndex === pointIndex && this.lines[i].nodeTwoIndex === pointNodeIndex){
                return i
            }
        }
        return -1;
    }
}
