

function testTable(){
    if(inc_dico < dictionnaire.length){
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