setTimeout(testTable,2000);
setTimeout(displayGame,5000);

function testTable(){
    if(inc_dico < dictionnaire.length){
        tableCreate();
    }
    else{
        document.getElementById("total_to_load").textContent = dictionnaire.length;
        document.getElementById("nb_loaded").textContent = inc_dico;
    }
}
function displayGame(){

    var random = Math.floor(Math.random() * inc_dico) + 1;
    console.log("random",random);
    getWord(random);
   
}

function displayWord(word){
    for (var i=0;i<word.length; i++){
        document.getElementById("L1C"+(i+1)).innerHTML=word[i];
    }
}