export class Editor {
    self;
    container;
    height;
    width;
    isVisible = false;
    node;
    canvas;
    constructor(canvas){
        this.canvas = canvas;
        this.self = document.getElementById("editor");
        this.container = document.getElementById("editor_container");
        this.self.className = "hidden";
        this.isVisible = false;

        return this;
    }

    setNode(node){
        let template = `<input class="editor_input" id="{{id}}" type="text" value="{{value}}" placeholder="{{name}}">`;
        let data = "";
        this.node = node;
        node.data.outputs.forEach((i, index)=>{
            let d = template;
            d = d.replace("{{value}}", i.name);
            d = d.replace("{{name}}", i.name);
            d = d.replace("{{id}}", i.id + "_" + index);
            data +=  d;
        });
        this.container.innerHTML = data;

    }

    deleteNode(){
        this.canvas.deleteNode(this.node);
    }

    show(pos){
        this.self.className = "";
        this.isVisible = true;

        this.self.style.top = +  pos.y +"px";
        this.self.style.left = pos.x + 'px';
    }

    hide(){
        this.self.className = "hidden";
        this.isVisible = false;
    }
}
