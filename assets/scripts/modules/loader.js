let loadTemp = (link) => {
    let loader = document.getElementById("loader");
    loader.className = "";
    let container = document.getElementById("main-container");
    fetch('templates/html/' + link + '.html')
        .then(e=>{
            e.text().then(e=>{
                let node = document.getElementById("script-delete");
                if(node !== null){
                    node.remove();
                }
                container.innerHTML = e;
                loader.className = "hidden";
                let s = document.createElement('script');
                s.src = 'templates/js/' + link + '.js';
                s.type = 'module';
                s.id = 'script-delete';
                document.body.appendChild(s);
            })
        })
};
export class Loader {
    constructor() {
        let links = document.getElementsByClassName("loader");
        for (let i = 0; i < links.length; i++) {
            links[i].addEventListener("click", this.click, false)
        }
        this.loader = document.getElementById("loader");
        this.last = "";
    }

    click(e){
        let dataset = e.target.dataset;
        let link = dataset.link;
        if (link !== ''){
            loadTemp(link)
        }else {
            this.loader.className = "hidden";
        }
    }

    load(link){
        loadTemp(link)
    }
}
