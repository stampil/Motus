function construct_game_table(){
    var o = document.getElementById("tableau");
    var table = document.createElement('table');
    table.setAttribute('id', 'game_table');
    o.appendChild(table);
    for(var i=0; i<nb_essai; i++){
        var tr = document.createElement('tr');
        for (var j=0; j<dictionnaire[0].length; j++){
            var td = document.createElement('td');
            var div = document.createElement('div');
            div.setAttribute('id', 'L'+(i+1)+'C'+(j+1));
            tr.appendChild(td).appendChild(div);
        }   
        table.appendChild(tr);
    }
}
construct_game_table();

function testTable(){
    if(inc_dico < dictionnaire.length-1){
        tableCreate();
    }
    else{
        document.getElementById("nb_loaded").textContent = Math.round(inc_dico/dictionnaire.length*100)+'%';
    }
}


function displayWord(line,mot){
    for (var i=0;i<mot.length; i++){
        document.getElementById("L"+line+"C"+(i+1)).innerHTML=mot[i];
    }
}