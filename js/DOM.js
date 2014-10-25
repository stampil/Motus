real.width = window.innerWidth;
real.height = window.innerHeight;

window.addEventListener("orientationchange", orientationChange, true);

console.log("start", new Date().getTime());


//console.log('si on met une instruction db.transaction ici, db à de forte chance de ne pas encore existé, à ce temps là: ',new Date().getTime());

function init() {

    console.log("INIT_GAME");
    initGame();
    getWord(1);

}


function getWord(line) {
    console.log("getWord call", line, new Date().getTime());

    displayWord(line, dictionnaire[Math.round(Math.random() * (dictionnaire.length - 1))]);
}

function validateWord(tryWord) {

    if (dictionnaire.indexOf(tryWord) != -1) return 1;
    return 0;

}

Array.prototype.getUnique = function () {
    var o = {}, a = [], i, e;
    for (i = 0; e = this[i]; i++) {
        o[e] = 1
    }
    ;
    for (e in o) {
        a.push(e)
    }
    ;
    return a;
}

function check_table(){
for (var i = 0; i < dictionnaire.length; i++) {
    if (dictionnaire[i].length != 7) console.error("erreur length dico !!!", dictionnaire[i]);
    if (dictionnaire.indexOf(dictionnaire[i]) != dictionnaire.lastIndexOf(dictionnaire[i])) {
        console.error("erreur multi-occurence dico !!!", dictionnaire[i]);
    }

}
}

function orientationChange() {
    var orientation = "portrait";
    if (window.innerWidth < window.innerHeight)
        orientation = "landscape"; // on mobile widthxheight are inversed
    if (orientation == "portrait") {
        document.getElementById("clavier").style.width = "auto";
    }
    else {
        document.getElementById("clavier").style.width = "260px";
    }

}


function constructGameTable() {
    var o = document.getElementById("tableau");
    o.innerHTML = "";
    var table = document.createElement('table');
    table.setAttribute('id', 'game_table');
    o.appendChild(table);
    for (var i = 0; i < nb_essai; i++) {
        var tr = document.createElement('tr');
        tr.setAttribute("id", "L" + (i + 1));
        for (var j = 0; j < dictionnaire[0].length; j++) {
            var td = document.createElement('td');
            var div = document.createElement('div');
            div.setAttribute('id', 'L' + (i + 1) + 'C' + (j + 1));
            div.textContent = ".";
            tr.appendChild(td).appendChild(div);
        }
        table.appendChild(tr);
    }
    setCurrentLine(1);
    setCurrentColumn(2);
}

function jumpKey() {
    if (goodKey[C - 1] != ".") {
        writeKey(goodKey[C - 1]);
    }
}

function eraseKey() {
    if (C <= 2)
        return;

    tryWord = tryWord.substr(0, tryWord.length - 1);
    C--;
    document.getElementById("L" + L + "C" + C).textContent = ".";
    setCurrentColumn(C);
}
function writeKey(key) {
    if (L > nb_essai) {
        return;
    }
    if (!document.getElementById("L" + L + "C" + C)) {
        return false;
    }
    document.getElementById("L" + L + "C" + C).textContent = key;
    tryWord += key;
    C++;


    if (C > dictionnaire[0].length) {

        var valid = validateWord(tryWord);
        ajax("action=statsTry&tryWord=" + tryWord + "&inDico=" + valid);


        if (!valid) {
            newLine();
            return;
        }


        compareWord(function () {
            if (tryWord == toFind) {

                ajax("action=gagner&tryWord=" + toFind);
                nb_reussite++;
                nb_game++;
                setTimeout(init, 1000);
                return true;
            }
            newLine();
        });


    } else {
        setCurrentColumn(C);
    }
}

function newLine() {
    C = 2;
    L++;
    setCurrentColumn(C);
    tryWord = "";

    if (document.getElementById("L" + L + "C" + 1)) {
        for (var i = 1; i < goodKey.length; i++) {
            document.getElementById("L" + L + "C" + (i + 1)).textContent = goodKey[i];
        }
        document.getElementById("L" + L + "C" + 1).textContent = document.getElementById("L" + (L - 1) + "C" + 1).textContent;
        tryWord = document.getElementById("L" + (L - 1) + "C" + 1).textContent.toUpperCase();
        setCurrentLine(L);
    }
    else {
        setSoluce();
        ajax("action=perdu&tryWord=" + toFind);


        nb_game++;
        setTimeout(init, 2000);
        return true;
    }
}

function compareWord(callback) {

    var call = 0;
    letter_checked = new Array();
    for (var i = 0; i < dictionnaire[0].length; i++) {
        setTimeout(function () {

            if (tryWord[call] == toFind[call]) {
                lightCase(L, (call + 1), "good_placement");

            }
            else {

                if (is_bad_placed(tryWord[call])) {
                    lightCase(L, (call + 1), "bad_placement");
                }
                else {
                    //check;
                }
            }
            call++;
            if (call == dictionnaire[0].length && typeof callback == "function")
                callback();
        }, 500 * i);
    }
}

function is_bad_placed(key) {
    for (var i = 0; i < toFind.length; i++) {
        if (tryWord[i] == toFind[i]) {
            goodKey[i] = tryWord[i];
        }
    }

    for (var i = 0; i < toFind.length; i++) {
        if (toFind[i] == key && goodKey[i] == "." && letter_checked.indexOf(key) == -1) {
            letter_checked.push(key);
            //si pas encore trouvé ( goodKey[i] =="." = remplir le goodkey ici ( avant le if et pas dans le settimeout
            return true;
        }
    }
}

function constructClavier() {
    var o = document.getElementById("clavier");
    o.innerHTML = "";
    var a = 97;
    for (var i = 0; i < 26; i++) {
        var key = String.fromCharCode(a + i);
        var div = document.createElement("div");
        div.setAttribute('id', 'touche_' + key);
        div.setAttribute('value', key);
        div.setAttribute('class', 'touches');
        div.textContent = key;
        div.onclick = function (ce) {
            writeKey(ce.target.innerText);
        };
        o.appendChild(div);
    }
    var div = document.createElement("div");
    div.setAttribute('id', 'touche_back');
    div.setAttribute('value', '-1');
    div.setAttribute('class', 'touches');
    div.textContent = '←';
    div.onclick = function () {
        eraseKey();
    };
    o.appendChild(div);
    var div = document.createElement("div");
    div.setAttribute('id', 'touche_back');
    div.setAttribute('value', '1');
    div.setAttribute('class', 'touches');
    div.textContent = '→';
    div.onclick = function () {
        jumpKey();
    };
    o.appendChild(div);
}

function initGame() {
    C = 2;
    L = 1;
    for (var i = 0; i < dictionnaire[0].length; i++) {
        goodKey[i] = ".";
    }
    constructGameTable();
    constructClavier();
    adaptTablette();
    valign();
    displayScore();
}

function adaptTablette() {
    console.log("adapt", real.width);
    if (real.width > 600) {
        console.log('tablette');
        console.info(document.getElementById('game_table'));
        document.getElementById('game_table').classList.add("tablette");
        console.log(document.getElementById('game_table'));
        document.getElementById('clavier').classList.add("tablette");
    }
    else {
        console.log("pas tablette");
    }
}

function valign() {// height et width sont inversé sur smartphone
    var content_width = document.getElementById('content').offsetWidth;
    var x = Math.max(0, Math.floor((real.width - content_width ) / 2));
    document.getElementById('content').style.marginTop = x + "px";
}



function displayWord(line, mot) {
    toFind = mot.toUpperCase();
    tryWord = toFind[0];
    document.getElementById("L" + line + "C" + 1).innerHTML = mot[0];

}

function lightCase(line, column, type) {
    document.getElementById("L" + line + "C" + column).classList.add(type);
}

function setCurrentLine(line) {
    for (var i = 1; i <= nb_essai; i++) {
        document.getElementById("L" + i).classList.remove("current_line");
    }
    document.getElementById("L" + line).classList.add("current_line");
}

function setCurrentColumn(col) {
    if (!document.getElementById("L" + L + "C" + col))
        return false;
    for (var i = 1; i <= dictionnaire[0].length; i++) {
        if (document.getElementById("L" + (L - 1) + "C" + i)) {
            document.getElementById("L" + (L - 1) + "C" + i).classList.remove("current_column");
        }
        document.getElementById("L" + L + "C" + i).classList.remove("current_column");
    }

    document.getElementById("L" + L + "C" + col).classList.add("current_column");
}

function setSoluce() {
    document.getElementById("L" + nb_essai).classList.add("soluce");
    for (var i = 0; i <= dictionnaire[0].length - 1; i++) {

        document.getElementById("L" + nb_essai + "C" + (i + 1)).textContent = toFind[i];
    }
}

function displayScore() {
    document.getElementById('score').textContent = "mot" + (nb_reussite > 1 ? "s" : "") + " trouvé" + (nb_reussite > 1 ? "s" : "") + " : " + nb_reussite + "/" + nb_game;
}


function ajax(data) {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://vps36292.ovh.net/mordu/motus.php?' + data, true);
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                console.info("ret ajax", req.responseText);
            }
        }
    };
    req.send(null);
}

init();
/*
document.getElementById('version').innerHTML='';
for(var i=13104; i<dico.length; i++){
    console.log(i,dico[i].Mot);
    document.getElementById('version').innerHTML+='"'+dico[i].Mot.toUpperCase()+'",';
}*/