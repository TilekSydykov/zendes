import {NodeTitle, NodePoint} from './Util.js';

export class Node {

    data = {};

    x = 100;
    y = 100;
    height = 0;
    width = 100;
    headerHeight = 30;
    itemHeight = 30;

    name = '';
    body =  '';
    output = [];
    input = [];

    points = [];
    titles = [];

    color = '#ffffff';

    namePadding = 10 + 10;
    titleFont = '100 12px Arial';
    titleColor = '#1d1d1d';
    titleMargin = 10;

    editTitle = "Edit";
    editTitleHeight = 25;
    editTitleStart = 0;

    init(ctx) {
        this.height += this.headerHeight;
        this.height += this.editTitleHeight;

        let outputLength = this.output.length;
        let item;
        let outputsMaxWidth = 10;
        let inputMaxWidth = 10;
        ctx.font = this.titleFont;
        let textMetrics;
        for (let i = 0; i < outputLength; i++) {
            item = this.output[i];
            textMetrics = ctx.measureText(item);
            if (outputsMaxWidth < textMetrics.width + 20){
                outputsMaxWidth = textMetrics.width + 20
            }
        }
        let inputLength = this.input.length;
        let title = '';
        for (let i = 0; i < inputLength; i++) {
            title = this.input[i];
            textMetrics = ctx.measureText(title);
            this.titles.push(new NodeTitle(
                 this.titleMargin ,
                this.headerHeight + this.itemHeight * (i + 1) - (this.itemHeight / 2) + 3,
                textMetrics.width,
                title
            ));

            this.points.push(new NodePoint(
                0,
                this.headerHeight + this.itemHeight * (i + 1) - (this.itemHeight / 2), 'i'));

            if (inputMaxWidth < textMetrics.width + 20){
                inputMaxWidth = textMetrics.width + 20
            }
        }
        if(this.width < inputMaxWidth + outputsMaxWidth + 20 ){
            this.width = inputMaxWidth + outputsMaxWidth + 20;
        }
        for (let i = 0; i < outputLength; i++) {
            item = this.output[i];

            textMetrics = ctx.measureText(item);
            this.titles.push(new NodeTitle(
                this.width - this.titleMargin - textMetrics.width,
                this.headerHeight + this.itemHeight * (i + 1) - (this.itemHeight / 2) + 3,
                textMetrics.width,
                item
            ));

            this.points.push(new NodePoint(
                this.width,
                this.headerHeight + this.itemHeight * (i + 1) - (this.itemHeight / 2),
                'o'));
        }
        this.editTitleStart = (this.width/2) - (ctx.measureText(this.editTitle).width/2);

        this.heightMultiplier = Math.max(this.output.length, this.input.length);
        this.height += this.itemHeight * this.heightMultiplier;
        return this;
    }

    setData(data){
        this.data = data;
        this.name = data.name;
        data.inputs.forEach(i => {
            this.input.push(i.name);
        });
        data.outputs.forEach(i => {
            this.output.push(i.name)
        });
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = "#999999";
        context.fillStyle = this.color;
        context.rect(this.x, this.y, this.width, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.fill();

        context.fillStyle = '#000';
        context.font = "15px Arial";
        context.fillText(this.name, this.x + 10 , this.y + this.namePadding);
        context.beginPath();
        context.fillStyle = '#e4e4e4';
        context.rect(
            this.x,
            this.y + this.headerHeight,
            this.width,
            this.height  - this.headerHeight
        );
        context.fill();
        let item;
        for (let i = 0; i < this.points.length; i++) {
            item = this.points[i];
            context.beginPath();
            context.fillStyle = '#222222';
            context.arc(this.x + item.x, this.y + item.y, item.r, 0, 2 * Math.PI);
            context.fill();
        }
        context.font = this.titleFont;
        context.fillStyle = this.titleColor;
        for (let i = 0; i < this.titles.length; i++) {
            item = this.titles[i];
            context.fillText(item.txt, this.x + item.x , this.y + item.y);
        }

        context.beginPath();
        context.fillStyle = '#ffffff';
        context.rect(
            this.x,
            this.y + this.height - this.editTitleHeight,
            this.width,
            this.editTitleHeight
        );
        context.fill();
        context.fillStyle = '#0800cf';
        context.font = "13px Arial";
        context.fillText(this.editTitle, this.x + this.editTitleStart, this.y + this.height - this.editTitleHeight + 16);

    }

    moveX(x){this.x -= x}
    moveY(y){this.y -= y}
    moveTo(x, y){this.x = x;this.y = y;}
    isSelected(x, y) {return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.headerHeight}
    isInBounds(x, y) {
        let r = 4;
        return x > this.x - r &&
            x < this.x + this.width + r &&
            y > this.y + this.headerHeight &&
            y < this.y + this.height + this.headerHeight
    }
    isEditSelected(x, y){return x > this.x && x < this.width + this.x && y > this.y + this.height - this.editTitleHeight && y < this.y + this.height}
    isPointSelected(x, y){
        let item = null;

        for (let i = 0; i < this.points.length; i++) {
            item = this.points[i];
            let radius = item.r + 5;
            if (x > item.x + this.x - radius  &&
                x < item.x + this.x - radius + radius * 2 &&
                y > item.y + this.y - radius &&
                y < item.y + this.y - radius + radius * 2){
                return {item, i};
            }
        }
        return null;
    }
}
