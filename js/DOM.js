window.addEventListener("orientationchange", orientationChange, true);

var nb_orient = 0;
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
}

function writeKey(key) {
    console.log(L, C, nb_essai);
    if (L > nb_essai) {
        console.log('end2');
        return;
    }
    document.getElementById("L" + L + "C" + C).textContent = key;
    tryWord +=key;
    C++;

    if (C > dictionnaire[0].length) {
        console.log('mot:'+tryWord);
        C = 2;
        L++;
        tryWord="";
        if (document.getElementById("L" + L + "C" + 1)) {
            document.getElementById("L" + L + "C" + 1).textContent = document.getElementById("L" + (L - 1) + "C" + 1).textContent;
            tryWord =  document.getElementById("L" + (L - 1) + "C" + 1).textContent.toUpperCase();
            setCurrentLine(L);
        }
        else {
            setSoluce();
            console.log('end1');
        }

    }
}
function constructClavier() {
    var o = document.getElementById("clavier");
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
}
constructGameTable();
constructClavier();

function testTable() {
    if (inc_dico < dictionnaire.length - 1) {
        tableCreate();
    }
    else {
        document.getElementById("nb_loaded").textContent = Math.round(inc_dico / dictionnaire.length * 100) + '%';
    }
}


function displayWord(line, mot) {
    toFind = mot;
    tryWord = mot[0].toUpperCase();
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

function setSoluce(){
    document.getElementById("L" + nb_essai).classList.add("soluce");
    for (var i = 0; i <= dictionnaire[0].length; i++) {
        document.getElementById("L" + nb_essai+"C"+(i+1)).textContent=toFind[i];
    }
}

/*
lightCase(1, 1, "good_placement");
lightCase(1, 2, "good_placement");
lightCase(1, 3, "bad_placement");
lightCase(1, 7, "bad_placement");*/