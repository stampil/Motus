setTimeout(testTable,2000);
setTimeout(displayGame,5000);

function testTable(){
    if(inc_dico < dictionnaire.length){
        tableCreate();
    } 
}
function displayGame(){

    var random = Math.floor(Math.random() * inc_dico) + 1;
    console.log("random",random);
    getWord(random);
   
}

function displayWord(word){
     document.getElementById("game").innerHTML=inc_dico+') '+word;
}