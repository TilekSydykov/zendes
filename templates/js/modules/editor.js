export class Editor {
    self;
    container;
    height;
    width;
    isVisible = false;
    constructor(){
        this.self = document.getElementById("editor");
        this.container = document.getElementById("editor_container");
        this.self.className = "hidden";
        this.isVisible = false;
        return this;
    }

    setNode(node, pos){

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
