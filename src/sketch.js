var koma_list;
var selectedKoma;
setup = function(){
    var canvas = createCanvas(1200,820);
    canvas.parent("sketch");
    initKoma();
    print("setup");
}

function initKoma(){
    koma_list = [];
    let isSente = true;
    let dir = 1;
    for(n of [6,2]){
        for(var i = 0; i < MASU_COUNT; i++){
            koma_list.push(new Koma("歩", n,i,isSente));
        }
        koma_list.push(new Koma("飛", n+dir,isSente?1:7,isSente));
        koma_list.push(new Koma("角", n+dir,isSente?7:1,isSente));

        const koma_names = ["香", "桂", "銀", "金"];
        i = 0;
        for(koma_name of koma_names){
            koma_list.push(new Koma(koma_name, n+dir*2,i,isSente));
            koma_list.push(new Koma(koma_name, n+dir*2,8-i,isSente));
            i++
        }
        koma_list.push(new Koma("玉", n+dir*2,4,isSente));
        dir = -1;
        isSente = false;
    }
}

const margin_y = 100;
const margin_x = 100;
const MASU_SIZE = 60;
const MASU_COUNT = 9;
const BOARD_WIDTH = MASU_SIZE* MASU_COUNT;

draw = function(){
    background(225);
    initKoma();
    drawBoard();
    drawKoma();
}

function drawBoard(){
    fill("#F5A210");
    rect(margin_x, margin_y,  BOARD_WIDTH, BOARD_WIDTH);
    for(var i = 0; i < MASU_COUNT + 1; i++){
        const x = i*MASU_SIZE;
        line(margin_x + x, margin_y, margin_x+ x, margin_y+BOARD_WIDTH);
    }
    for(i = 0; i < MASU_COUNT + 1; i++){
        const y = i*MASU_SIZE;
        line(margin_x, margin_y + y, margin_x + BOARD_WIDTH, margin_y + y);
    }
}

function drawKoma(){
    for(koma of koma_list){
        koma.display();
    }
}

mousePressed = function(){
    var c = (mouseX - margin_x) / MASU_SIZE | 0;
    var r = (mouseY - margin_y) / MASU_SIZE | 0;
    let koma = findKoma(r,c);
    if(koma) {
        koma.isSelected = true;
        if(selectedKoma) selectedKoma.isSelected = false;
        selectedKoma = koma;
    }
};

function findKoma(r,c){
    for(var koma of koma_list){
        if(koma.r == r && koma.c == c)return koma;
    }
    return null;
}

var Koma = class {
    constructor(name, r, c, isSente){
        this.name = name;
        this.r = r;
        this.c = c;
        this.isSente = isSente;
        this.isSelected = false;
    }
    display(){
        push();
        translate(this.getX(), this.getY());
        if(!this.isSente){
            rotate(PI);
        }
        textAlign(CENTER, CENTER);
        fill(0);
        stroke(0);
        textSize(20);
        text(this.name, 0,0);
        pop();
        if(this.isSelected){
            fill(255,0,0);
            rect(margin_x + this.c * MASU_SIZE, margin_y + this.r * MASU_SIZE, MASU_SIZE, MASU_SIZE);
        }
    }
    getX(){
        return margin_x + this.c * MASU_SIZE + MASU_SIZE*0.5;
    }
    getY(){
        return margin_y + this.r * MASU_SIZE + MASU_SIZE*0.5;
    }
}
