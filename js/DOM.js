 window.addEventListener("orientationchange", orientationChange, true);

 var nb_orient=0;
 function orientationChange() {
     var orientation = "portrait";
     if(window.innerWidth>window.innerHeight) orientation = "landscape";
     if(orientation=="landscape"){
         document.getElementById("clavier").style.width="auto";
     }
     else{
         document.getElementById("clavier").style.width="190px";
     }
    document.getElementById("version").innerHTML="orientation "+(++nb_orient)+" "+orientation+" "+window.innerWidth+"x"+window.innerHeight+", "+screen.width+"x"+screen.height;
    if( window.orientation) alert( window.orientation);
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

function light_case(line,column,type){
    document.getElementById("L" + line + "C" + column).classList.add(type);
}
light_case(1,1,"not_exist");
light_case(1,2,"not_exist");
light_case(1,6,"bad_placement");
light_case(1,7,"bad_placement");