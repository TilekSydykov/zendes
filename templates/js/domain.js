import {Canvas} from "./modules/canvas.js";
import {Node} from "./modules/node.js";
import {Nodes} from "./modules/buildInNodes.js"
import {Editor} from "./modules/editor.js";

let topHeight = document.getElementsByClassName("app-header__content")[0].clientHeight;
let sideWidth = document.getElementsByClassName("app-sidebar")[0].clientWidth;

let c = new Canvas("domain_canvas");
c.init();
let finder = document.getElementById("finder");
let editor = new Editor();

finder.isVisible = false;
c.canvas.onmousedown = function(e){
    if(editor.isVisible){editor.hide();}
    if(finder.isVisible){finder.className = "hidden";}

    if (e.button === 0){
        c.selectNode(e);
        if(finder.isVisible){
            finder.className = "hidden"
        }
    }else if (e.button === 1){
        c.entireMove(e);
    }

};

c.canvas.addEventListener("contextmenu", (e) => {
    finder.className = "";
    finder.isVisible = true;

    let pos = c.getMousePos(c.canvas, e);
    pos.y += topHeight;
    pos.x += sideWidth;

    if (pos.x + finder.clientWidth >= e.target.clientWidth){
        pos.x = pos.x - finder.clientWidth;
    }

    if(pos.y + finder.clientHeight >= e.target.clientHeight){
        pos.y = pos.y -finder.clientHeight;
    }

    finder.style.top = +  pos.y +"px";
    finder.style.left = pos.x + 'px';

    e.preventDefault();
});

c.editNodeListener = (node, pos) =>{
    editor.setNode(node);
    pos.y += topHeight;
    pos.x += sideWidth;
    if (pos.x + editor.self.clientWidth >= c.canvas.clientWidth){pos.x = pos.x - editor.self.clientWidth;}
    if(pos.y + editor.self.clientHeight >= c.canvas.clientHeight){pos.y = pos.y - editor.self.clientHeight;}
    editor.show(pos);
};

c.canvas.onmousemove = function(e){
    c.moveSelectedNode(e)
};

c.canvas.onmouseup = function(e){
    c.deselectNode(e);
};

window.onresize = function (e){
    c.resize();
};

let nodes = document.getElementsByClassName("node");
for (let i = 0; i < nodes.length; i++) {
    nodes[i].onmousedown = function(e){
        let d = e.target.dataset;

        let node = new Node();

        node.setData(Nodes[d.id]);
        c.addNodeWithDrag(node.init(c.context));
        finder.className = "hidden";
    }
}
