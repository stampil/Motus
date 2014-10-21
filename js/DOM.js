window.addEventListener("orientationchange", orientationChange, true);


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

function jumpKey(){
    if(goodKey[C-1]!="."){
        writeKey(goodKey[C-1]);
    }
}

function eraseKey(){
    if(C<=2) return;

    tryWord = tryWord.substr(0,tryWord.length-1);
    C--;
    document.getElementById("L" + L + "C" + C).textContent = ".";
    setCurrentColumn(C);
}
function writeKey(key) {
    console.log(L, C, nb_essai);
    if (L > nb_essai) {
        console.log('must wait');
        return;
    }
    if (!document.getElementById("L" + L + "C" + C)) {
        return false;
    }
    document.getElementById("L" + L + "C" + C).textContent = key;
    tryWord += key;
    C++;


    if (C > dictionnaire[0].length) {
        console.log('mot:' + tryWord);
        
        validateWord(tryWord, function(wordValid){
            console.log("validate",tryWord,wordValid );
            if(!wordValid){
                newLine();
                return;
            }
            
            compareWord(function () {
            if (tryWord == toFind) {
                console.log("gagner");
                nb_reussite++;
                nb_game++;
                setTimeout(init,1000);
                return true;
            }
            newLine();
        });

        });
        


    } else {
        setCurrentColumn(C);
    }
}

function newLine(){
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
                console.log('perdu');
                nb_game++;
                setTimeout(init,2000);
                return true;
            }
}

function compareWord(callback) {
    console.log(tryWord, toFind);
    var call = 0;
    letter_checked=new Array();
    for (var i = 0; i < dictionnaire[0].length; i++) {
        setTimeout(function () {
            console.log("timeout", call);
            if (tryWord[call] == toFind[call]) {
                lightCase(L, (call + 1), "good_placement"); 
            }
            else{
                
                 if(is_bad_placed(tryWord[call])){
                     lightCase(L, (call + 1), "bad_placement");
                 }
            }
            call++;
            if (call == dictionnaire[0].length && typeof callback == "function")
                callback();
        }, 500 * i);
    }
}

function is_bad_placed(key){
    for (var i =0; i <toFind.length; i++){
        if (tryWord[i] == toFind[i]) {
            goodKey[i] = tryWord[i];
        }
    }
    
    
    for (var i =0; i <toFind.length; i++){
        if(toFind[i]==key && goodKey[i]=="." && letter_checked.indexOf(key)==-1 ){
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
        goodKey[i]=".";
    }
    constructGameTable();
    constructClavier();
    displayScore();
}


function testTable() {
    if (inc_dico < dictionnaire.length - 1) {
        tableCreate();
    }
    else {
       if(document.getElementById("nb_loaded")) document.getElementById("nb_loaded").textContent = Math.round(inc_dico / dictionnaire.length-1 * 100) + '%';
    }
    if(Math.round(inc_dico / dictionnaire.length * 100) == 100) document.getElementById("loading_dico").textContent="";
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
    console.log('setcol', col);
    document.getElementById("L" + L + "C" + col).classList.add("current_column");
}

function setSoluce() {
    document.getElementById("L" + nb_essai).classList.add("soluce");
    for (var i = 0; i <= dictionnaire[0].length-1; i++) {
        console.log("dom","L" + nb_essai + "C" + (i + 1), i,  toFind[i]);
        document.getElementById("L" + nb_essai + "C" + (i + 1)).textContent = toFind[i];
    }
}

function displayScore() {
    document.getElementById('score').textContent = "mot" + (nb_reussite > 1 ? "s" : "") + " trouvé" + (nb_reussite > 1 ? "s" : "") + " : " + nb_reussite + "/" + nb_game;
}