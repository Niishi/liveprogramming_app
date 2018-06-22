const fs = require('fs');

function onLoad(){
    editor = ace.edit("input_txt");
    editor.$blockScrolling = Infinity;
    editor.getSession().setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/chrome");
    editor.setFontSize(20);
    editor.setHighlightActiveLine(false);
    editor.on('change', func1);
}

const KEY_TIME = 1000;   //1000msだけキー入力を待つ
let keyStack = [];  //入力数を保存する変数
function func1(e) {
    if(e.lines[0].length === 1){    // NOTE: これはかなりテキトーなやり方。再考が必要。
        keyStack.push(1);  //1はテキトーな数。本当はkeyなどを入れた方が良さげ
        setTimeout(function(){
            keyStack.pop();
            if(keyStack.length === 0){
                run();
                keyStack = [];  //一応初期化
            }
        },KEY_TIME);
    }
}

function run() {
    saveCode();
    var container = document.getElementById("sketch");
    container.insertAdjacentHTML("afterbegin", '<script id="sketchjs" src="sketch.js"></script>');
    var codeText = getAceEditor().getValue();
    try{
        eval(codeText);
    }catch(e){
        // console.log(e);
    }
}

readFile("./src/sketch.js");
function readFile(path) {
    fs.readFile(path, function(error, buffer) {
        if (error != null) {
            alert("error : " + error);
            return;
        }
        var editor = getAceEditor();
        var text = buffer.toString('utf-8',0,buffer.length);    //Bufferのままではaceのエディタに設定できないので文字列に変換している
        editor.setValue(text,-1);
        editor.blur();
    });
}

function saveCode() {
    var codeText = getAceEditor().getValue();
    saveFile("./src/sketch.js", codeText);
}

function saveFile(path, data) {
    fs.writeFile(path, data, function(error) {
        if (error != null) {
            alert('error : ' + error);
            return;
        }
    });
}

function getAceEditor() {
    return ace.edit("input_txt");
}
