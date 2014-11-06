real.width = window.innerWidth;
real.height = window.innerHeight;


lengthWord= dictionnaire[0].Mot.length;
console.log("start", new Date().getTime());

document.addEventListener('deviceready', function() {
  is_mobile=true;
  navigator.splashscreen.hide();
});

beepCheck = new EmulMedia('beepCheck.mp3');
beepError = new EmulMedia('beepError.mp3');
beepGood = new EmulMedia('beepGood.wav');
beepNotHere = new EmulMedia('beepNotHere.mp3');
clap = new EmulMedia('clap.mp3');
boo = new EmulMedia('boo.mp3');
gasp= new EmulMedia('gasp.mp3');

initGame();

function initGame() {
    document.getElementById('numVersion').textContent=version;
    console.log("GAME",nb_reussite_total,nb_reussite,nb_game);
    C = 2;
    L = 1;
    var nb_indice=0;
    
    

    
    if(nb_game%declenchement_super_parti+1==declenchement_super_parti){
        nb_essai = nb_essai_super_partie;
        nb_indice = Math.floor(nb_reussite/2);
        constructGameTable();
        document.getElementById("nb_indice_sp").textContent=nb_indice;
        nb_reussite=0;
    }
    else{
       nb_essai = nb_essai_partie_normale;
       constructGameTable(); 
       document.getElementById("nb_indice_sp").textContent=Math.floor(nb_reussite/2);
    }
    
    
    constructClavier();
    valign();
    getWord(1, nb_indice);
    displayScore();
}

function EmulMedia(url){
    
    var dom;
    var EmulMedia = function(url){
        dom = document.createElement('audio');
        var source = document.createElement('source');
        source.setAttribute("src","res/raw/"+url);
        source.setAttribute("type","audio/"+url.split('.')[1]);
        dom.appendChild(source);      
    }
    EmulMedia(url);
    
    this.play = function(){
        if(is_mobile){//mobile
            playAudio(url);
            return false;
        }
        dom.play();
    };
    this.seekTo = function(to){
        if(is_mobile){//mobile
            return false;
        }
        if(dom.duration)  dom.currentTime=to;
    };

}

function playAudio(uri) {
    var url = getPhoneGapPath()+ uri;
    var my_media = new Media(url,
            // success callback
             function () { my_media.release() },
            // error callback
             function (err) { document.getElementById('version').textContent=err; }
    );
    my_media.play();
           // Play audio
}

function getWord(Dur,nb_indice) {
    var random = Math.round(Math.random() * (dictionnaire.length - 1));
    if(dictionnaire[random].Dur != Dur){
        getWord(Dur,nb_indice);
        return;
    }
    displayWord(1, dictionnaire[random].Mot,nb_indice);
    return;
}

function validateWord(tryWord) {

    if (searchDico(tryWord) != -1) return 1;
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

function checkTable(){
    for (var i = 0; i < dictionnaire.length; i++) {
        if (dictionnaire[i].Mot.length != 7) console.error("erreur length dico !!!", dictionnaire[i].Mot);
        if (checkOccurence(dictionnaire[i].Mot)>1) {
            console.error("erreur multi-occurence dico !!!", dictionnaire[i]);
        }

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
        for (var j = 0; j < lengthWord; j++) {
            var td = document.createElement('td');
            var div = document.createElement('div');
            div.setAttribute('id', 'L' + (i + 1) + 'C' + (j + 1));
            div.textContent = ".";
            tr.appendChild(td).appendChild(div);
        }
        table.appendChild(tr);
    }
    var tr = document.createElement('tr');
    tr.setAttribute("id", "super_partie");
    var td = document.createElement('td');
    td.setAttribute("colspan",lengthWord);
    var div = document.createElement('div');
    div.setAttribute("id","content_super_partie");
    var div_contenu = document.createElement('div');
    div_contenu.setAttribute("id","contenu_super_partie");
    div_contenu.setAttribute("style","width:"+document.getElementById('game_table').clientWidth+"px !important");
    div_contenu.innerHTML="super partie, nb_indice:<span id='nb_indice_sp'>0</span>";
    table.appendChild(tr).appendChild(td).appendChild(div).appendChild(div_contenu);
    document.getElementById('content_super_partie').style.width=( (nb_game%declenchement_super_parti)/(declenchement_super_parti-1))*100+"%";

    
        
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

    if (C > lengthWord) {

        var valid = validateWord(tryWord);
        ajax("action=statsTry&tryWord=" + tryWord + "&inDico=" + valid);


        if (!valid) {
            beepError.seekTo(0);
            beepError.play();
            newLine();
            return;
        }

        compareWord(function () {
            if (tryWord == toFind) {
                clap.play();
                ajax("action=gagner&tryWord=" + toFind);
                nb_reussite++;
                nb_reussite_total++;
                nb_game++;
                setTimeout(initGame, 1000);
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
        boo.play();
        setSoluce();
        ajax("action=perdu&tryWord=" + toFind);


        nb_game++;
        setTimeout(initGame, 2000);
        return true;
    }
}

function compareWord(callback) {

    var call = 0;
    letter_checked = new Array();
    for (var i = 0; i < lengthWord; i++) {
        setTimeout(function () {

            if (tryWord[call] == toFind[call]) {
                beepGood.seekTo(0);
                beepGood.play();
                lightCase(L, (call + 1), "good_placement");

            }
            else {

                if (is_bad_placed(tryWord[call])) {
                    beepNotHere.seekTo(0);
                    beepNotHere.play();
                    lightCase(L, (call + 1), "bad_placement");
                }
                else {
                    beepCheck.currentTime=0;
                    beepCheck.play();
                    //check;
                }
            }
            call++;
            if (call == lengthWord && typeof callback == "function")
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

function valign() {// height et width sont inversé sur smartphone
    var content_width = document.getElementById('content').offsetWidth;
    var x = Math.max(0, Math.floor((real.width - content_width ) / 2));
    document.getElementById('content').style.marginTop = x + "px";
}

function displayWord(line, mot, nb_indice) {
    if(!nb_indice){
        nb_indice=0;
    }
    toFind = mot;
    tryWord = toFind[0];
    
    for (var i = 0; i < lengthWord; i++) {
        goodKey[i] = ".";
    }
    goodKey[0]= toFind[0];
    var indice_use = new Array();
    while(nb_indice>0){

        var indice = Math.round(Math.random()*5)+2; // on veux aller jusqu'a 7 (5+2) mais commencé avec 2 ( 0+2)
        if(indice_use.indexOf(indice)==-1){
            
            nb_indice--;
            indice_use.push(indice);
            goodKey[indice-1]= mot[indice-1];
            document.getElementById("L" + line + "C" + indice).innerHTML = mot[indice-1];
        }
    }
    
    
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
    for (var i = 1; i <= lengthWord; i++) {
        if (document.getElementById("L" + (L - 1) + "C" + i)) {
            document.getElementById("L" + (L - 1) + "C" + i).classList.remove("current_column");
        }
        document.getElementById("L" + L + "C" + i).classList.remove("current_column");
    }

    document.getElementById("L" + L + "C" + col).classList.add("current_column");
}

function setSoluce() {
    document.getElementById("L" + nb_essai).classList.add("soluce");
    for (var i = 0; i <= lengthWord - 1; i++) {
        var o = document.getElementById("L" + nb_essai + "C" + (i + 1));
        o.classList.remove("good_placement");
        o.classList.remove("bad_placement");
        o.textContent = toFind[i];
    }
}

function displayScore() {
    document.getElementById('score').textContent = "mot" + (nb_reussite_total > 1 ? "s" : "") + " trouvé" + (nb_reussite_total > 1 ? "s" : "") + " : " + nb_reussite_total + "/" + nb_game;
}

function ajax(data) {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://vps36292.ovh.net/mordu/motus.php?' + data+'&version='+version, true);
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                console.info("ret ajax", req.responseText);
            }
        }
    };
    req.send(null);
}

function searchDico(word){
    
    var index = arrayObjectIndexOf(dictionnaire, word, 'Mot');
    if(index>=0){
        if(dictionnaire[index].Dur==4){ 
            gasp.play();
        }
    }
    else{
        return index;
    }
    
}

function checkOccurence(word){
    var occ = 0;
    for(var i = 0, len = dictionnaire.length; i < len; i++) {
        if (dictionnaire[i].Mot === word) occ++;
    }
    return occ;
}

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function getPhoneGapPath() {
    var path = window.location.pathname;
    path = path.substr( path, path.length - 10 );
    return 'file://' + path+'res/raw/';

};