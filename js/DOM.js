 window.addEventListener("orientationchange", orientationChange, true);
 
 function orientationChange(e) {
         var orientation="portrait";
         if(window.orientation == -90 || window.orientation == 90) orientation = "landscape";
             document.getElementById("version").innerHTML+=orientation+" "+JSON.stringify(e);
     }

function construct_game_table() {
    var o = document.getElementById("tableau");
    var table = document.createElement('table');
    table.setAttribute('id', 'game_table');
    o.appendChild(table);
    for (var i = 0; i < nb_essai; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < dictionnaire[0].length; j++) {
            var td = document.createElement('td');
            var div = document.createElement('div');
            div.setAttribute('id', 'L' + (i + 1) + 'C' + (j + 1));
            div.textContent=".";
            tr.appendChild(td).appendChild(div);
        }
        table.appendChild(tr);
    }
}

var C=2;
var L=1;

function write_key(key){
    
    document.getElementById("L"+L+"C"+C).textContent=key;
    C++;
    
    if (C>dictionnaire[0].length){
        C=2;
        L++;
        document.getElementById("L"+L+"C"+1).textContent=document.getElementById("L"+(L-1)+"C"+1).textContent;
    }
}
function construct_clavier() {
    var o = document.getElementById("clavier");
    var a = 97;
    for (var i = 0; i < 26; i++) {
        var key = String.fromCharCode(a + i);
        var div = document.createElement("div");
        div.setAttribute('id', 'touche_' + key );
        div.setAttribute('value', key );
        div.setAttribute('class', 'touches');
        div.textContent=key;
        div.onclick = function(ce){
           write_key(ce.target.innerText); 
        };
        o.appendChild(div);
    }
}
construct_game_table();
construct_clavier();

function testTable() {
    if (inc_dico < dictionnaire.length - 1) {
        tableCreate();
    }
    else {
        document.getElementById("nb_loaded").textContent = Math.round(inc_dico / dictionnaire.length * 100) + '%';
    }
}


function displayWord(line, mot) {
    
        document.getElementById("L" + line + "C" + 1).innerHTML = mot[0];
    
}