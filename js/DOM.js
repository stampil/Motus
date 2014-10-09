

function testTable(){
    if(inc_dico < dictionnaire.length){
        tableCreate();
    }
    else{
        document.getElementById("nb_loaded").textContent = Math.round(inc_dico/dictionnaire.length*100)+'%';
    }
}
function displayGame(){

    var random = Math.floor(Math.random() * inc_dico) + 1;
    getWord(random);
   
}

function displayWord(mot){
    for (var i=0;i<mot.length; i++){
        document.getElementById("L1C"+(i+1)).innerHTML=mot[i];
    }
}