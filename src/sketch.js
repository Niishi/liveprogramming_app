var selectedKoma;
setup = function(){
    var canvas = createCanvas(1200,820);
    canvas.parent("sketch");
    print("setup");
}

var koma_list;
const margin_y = 100;
const margin_x = 100;
const MASU_SIZE = 60;
const MASU_COUNT = 9;
const BOARD_WIDTH = MASU_SIZE* MASU_COUNT;

var turn = true;

function isExistMikata(r,c,sente){
    var koma = findKoma(r,c);
    if(koma && koma.isSente == sente){
        return true;
    }
    return false;
}

function initKoma(){
    koma_list = [];
    let isSente = true;
    let dir = 1;
    
    fu = function(r,c){
        var dir = this.isSente? -1:1;
        if(this.r + dir == r && this.c == c){
            if(isExistMikata(r,c,this.isSente)){
                return false;
            }
            return true;
        }
        return false;
    };
    
    kyo = function(r,c){
        if(this.c != c){
            return false;
        }
        if((this.isSente && r < this.r) || (!this.isSente && r > this.r)){
            var dir = this.isSente ? -1:1;
            if(this.isSente){
                for(var i = this.r + dir; i >= r; i--){
                    if(findKoma(i, c)) return false;
                }
            }else{
                for(var i = this.r + dir; i < r; i++){
                    if(findKoma(i, c)) return false;
                }
            }
            if(!isExistMikata(r,c,this.isSente)){
                return true;
            }
        }
        return false;
    };
    
    keima = function(r,c){
        if(this.c + 1 == c || this.c - 1 == c){
            var dir = this.isSente ? -2:2;
            if(this.r + dir == r){
                if(!isExistMikata(r,c,this.isSente)){
                    return true;
                }
            }
        }
        return false;
    };
    
    gin = function(r,c){
        if(this.isSente){
            if(this.r  - 1 == r){
                if(this.c + 1 == c || this.c == c || this.c - 1 == c){
                    if(!isExistMikata(r,c,this.isSente)){
                        return true;
                    }
                }
            }else if(this.r + 1 == r){
                if(this.c + 1 == c || this.c - 1 == c){
                    if(!isExistMikata(r,c,this.isSente)){
                        return true;
                    }
                }
            }
        }else{
            if(this.r  + 1 == r){
                if(this.c + 1 == c || this.c == c || this.c - 1 == c){
                    if(!isExistMikata(r,c,this.isSente)){
                        return true;
                    }
                }
            }else if(this.r - 1 == r){
                if(this.c + 1 == c || this.c - 1 == c){
                    if(!isExistMikata(r,c,this.isSente)){
                        return true;
                    }
                }
            }
        }
        return false;
    };
    
    kin = function(r,c){
        if(this.isSente){
            if(this.r  - 1 == r){
                if(this.c + 1 == c || this.c == c || this.c - 1 == c){
                    if(!isExistMikata(r,c,this.isSente)){
                        return true;
                    }
                }
            }else if(this.r + 1 == r){
                if(this.c == c){
                    if(!isExistMikata(r,c,this.isSente)){
                        return true;
                    }
                }
            }else if(this.r == r){
                if(this.c + 1 == c || this.c - 1 == c){
                    if(!isExistMikata(r,c,this.isSente)){
                        return true;
                    }
                }
            }
        }else{
            if(this.r  + 1 == r){
                if(this.c + 1 == c || this.c == c || this.c - 1 == c){
                    if(!isExistMikata(r,c,this.isSente)){
                        return true;
                    }
                }
            }else if(this.r - 1 == r){
                if(this.c == c){
                    if(!isExistMikata(r,c,this.isSente)){
                        return true;
                    }
                }
            }else if(this.r == r){
                if(this.c + 1 == c || this.c - 1 == c){
                    if(!isExistMikata(r,c,this.isSente)){
                        return true;
                    }
                }
            }
        }
        return false;
    };
    
    gyoku = function(r,c){
        if(this.r ==r && this.c == c)return false;
        if(this.r - 1 == r || this.r == r || this.r + 1 == r){
            if(this.c -1 == c || this.c == c || this.c + 1 == c){
                return true;
            }
        }
        return false;
    };
    
    hisha = function(r,c){
        if(r == this.r && c == this.c) return false;
        if(r == this.r){
            if(c > this.c){
                for(var i = this.c + 1; i < c; i++){
                    if(findKoma(r, i)) return false;
                }
            }else{
                for(var i = this.c - 1; i > c; i--){
                    if(findKoma(r, i)) return false;
                }
            }
            if(!isExistMikata(r,c,this.isSente)) return true;
        }
        if(c == this.c){
            if(r > this.r){
                for(var i = this.r + 1; i < r; i++){
                    if(findKoma(i, c)) return false;
                }
            }else{
                for(var i = this.r - 1; i > r; i--){
                    if(findKoma(i, c)) return false;
                }
            }
            if(!isExistMikata(r,c,this.isSente)) return true;
        }
        return false;
    };
    
    kaku = function(r, c){
        if(r == this.r && c == this.c) return false;
        if(direction(r,this.r) != direction(c,this.c)) return false;
        let dirR = (r - this.r > 0) ? 1:-1;
        let dirC = (c - this.c > 0) ? 1:-1;
        let ir = this.r;
        let ic = this.c;
        for(var i = 0; i  < direction(r,this.r)-1; i++){
            ir += dirR;
            ic += dirC;
            if(findKoma(ir, ic)) return false;
        }
        if(!isExistMikata(r,c,this.isSente)) return true;
        return false;
    };


    for(n of [6,2]){
        for(var i = 0; i < MASU_COUNT; i++){
            koma_list.push(new Koma("歩", n,i,isSente, fu));
        }
        koma_list.push(new Koma("飛", n+dir,isSente?7:1,isSente, hisha));
        koma_list.push(new Koma("角", n+dir,isSente?1:7,isSente, kaku));

        const koma_names = ["香", "桂", "銀", "金"];
        const canMoves = [kyo, keima, gin,kin];
        i = 0;
        for(koma_name of koma_names){
            koma_list.push(new Koma(koma_name, n+dir*2,i,isSente, canMoves[i]));
            koma_list.push(new Koma(koma_name, n+dir*2,8-i,isSente, canMoves[i]));
            i++
        }
        koma_list.push(new Koma("玉", n+dir*2,4,isSente, gyoku));
        dir = -1;
        isSente = false;
    }
}

function direction(a, b){
    if(a > b) return a-b;
    else return b - a;
}

isStart = true;

draw = function(){
    if(isStart){
        initKoma();
        isStart = false;
    }
    background(225);
    drawBoard();
    drawKoma();
    fill(0);
    if(turn){
        textSize(24);
        text("先手",30,50);
    }else{
        text("後手",30,50);
    }
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
    if(selectedKoma && isOK(r,c) && selectedKoma.canMove(r,c)){
        selectedKoma.r = r;
        selectedKoma.c = c;
        selectedKoma.isSelected = false;
        selectedKoma = null;
        turn = !turn;
    }
    if(koma && koma.isSente == turn) {
        koma.isSelected = true;
        if(selectedKoma) selectedKoma.isSelected = false;
        selectedKoma = koma;
    }
};

function isOK(r,c){
    if(0 <= r && r < MASU_COUNT && 0 <= c && c < MASU_COUNT){
        return true;
    }
    return false;
}

function findKoma(r,c){
    for(var koma of koma_list){
        if(koma.r == r && koma.c == c)return koma;
    }
    return null;
}

var Koma = class {
    constructor(name, r, c, isSente, canMove){
        this.name = name;
        this.r = r;
        this.c = c;
        this.isSente = isSente;
        this.isSelected = false;
        this.canMove = canMove;
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
            fill(255,0,0, 80);
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
