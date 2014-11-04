real.width = window.innerWidth;
real.height = window.innerHeight;


lengthWord= dictionnaire[0].Mot.length;
console.log("start", new Date().getTime());

document.addEventListener('deviceready', function() {
  navigator.splashscreen.hide();
});

window.onload = initSound;

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}


function initSound() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      'res/raw/beepGood.wav',
      'res/raw/beepCheck.mp3',
      'res/raw/beepError.ogg',
      'res/raw/beepNotHere.mp3',
    ],
    finishedLoading
    );

  bufferLoader.load();
}



function finishedLoading(bufferList) {
  BUFFER = bufferList;
  
}

function playSound(id_sound) {
    if(typeof context=="undefined"){
        console.error('sound '+id_sound+' not initialized');
        return;
    }
  var source = context.createBufferSource();
  source.buffer = BUFFER[id_sound];
  source.connect(context.destination);
  source.start(0);
}




function init() {

    console.log("INIT_GAME");
    initGame();
    getWord(1);
    document.getElementById('numVersion').textContent=version;

}


function getWord(line) {
    var random = Math.round(Math.random() * (dictionnaire.length - 1));
    if(dictionnaire[random].Dur != 1){
        getWord(line);
        return;
    }
    displayWord(line, dictionnaire[random].Mot);
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
            playSound(beepError);
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
    for (var i = 0; i < lengthWord; i++) {
        setTimeout(function () {

            if (tryWord[call] == toFind[call]) {
                playSound(beepGood);
                lightCase(L, (call + 1), "good_placement");

            }
            else {

                if (is_bad_placed(tryWord[call])) {
                    playSound(beepNotHere);
                    lightCase(L, (call + 1), "bad_placement");
                }
                else {
                    playSound(beepCheck);
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

function initGame() {
    C = 2;
    L = 1;
    for (var i = 0; i < lengthWord; i++) {
        goodKey[i] = ".";
    }
    constructGameTable();
    constructClavier();
    valign();
    displayScore();
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

        document.getElementById("L" + nb_essai + "C" + (i + 1)).textContent = toFind[i];
    }
}

function displayScore() {
    document.getElementById('score').textContent = "mot" + (nb_reussite > 1 ? "s" : "") + " trouvé" + (nb_reussite > 1 ? "s" : "") + " : " + nb_reussite + "/" + nb_game;
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

init();

function searchDico(word){
    return arrayObjectIndexOf(dictionnaire, word, 'Mot');
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

