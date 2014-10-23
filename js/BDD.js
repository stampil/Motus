console.log("start",new Date().getTime());
check_inc = cookie.get("inc_dico");
if (check_inc) {
    inc_dico = parseInt(check_inc);
}

db = openDatabase('bdd', '', 'database', 5 * 1024 * 1024);
console.log('opendatabase send at  ',new Date().getTime());
interval_checkdb = setInterval(function(){
    if (db){
        console.log('opendatabase opened at',new Date().getTime());
        clearInterval(interval_checkdb);
        setTimeout(init,100);
    }
},1);
//console.log('si on met une instruction db.transaction ici, db à de forte chance de ne pas encore existé, à ce temps là: ',new Date().getTime());

function init(){
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS dictionnaire\n\
                             (mot VARCHAR)');
        setTimeout(testTable,20);
        setTimeout(function(){
            console.log("INIT_GAME");
            initGame();
            getWord(1);
        },501);
        
    });
}

function onError(e, t) {
    console.error(e, t);
}

function endLoading(){
    //peut etre appellé plusieurs fois a cause des multiples retour asynchrones
    document.getElementById('loading_dico').style.display="none";
    clearInterval(interval_dico);
}

function dicoInserted() {
    var ret = document.getElementById("nb_loaded");
    ret.textContent ="";
    if(inc_dico>=dictionnaire.length-1){
        //plein de retour asynchrone, les en retards on ne les traitent plus
        endLoading();
        return;
    }
    ret.textContent = Math.round(inc_dico / (dictionnaire.length - 1) * 100) + '%'+ ' (prise en compte de l\'orthographe à 100%)';
    inc_dico++;
    cookie.set("inc_dico", inc_dico);
}

function fillTable() {

    db.transaction(function (tx) {
        if (inc_dico > dictionnaire.length-1) {
            endLoading();
            //console.log("endLoading");
            return;
        }
        if(inc_dico == dictionnaire.length-1 && !last_insert){
            last_insert=true;
            //console.log("last insert");
        }
        else if(inc_dico == dictionnaire.length-1){
            //console.log("too late");
            return;
        }
        
        tx.executeSql(
            'INSERT INTO dictionnaire (mot) VALUES (?)',
            [dictionnaire[inc_dico]],
            dicoInserted,
            onError
        );
    });
}

function tableCreate() {
    document.getElementById('loading_dico').style.display = "block";
    document.getElementById("nb_loaded").textContent = Math.round(inc_dico/(dictionnaire.length-1)*100)+'%';
    if(interval_dico){ 
        clearInterval(interval_dico);
        interval_dico = null;
    }
    fillTable();
    interval_dico = setInterval(fillTable, 500);
}


function getWord(line) {
    console.log("getWord call",line, new Date().getTime());
    db.transaction(function (tx) {
        console.log('transaction select word');
        rowid = Math.floor(Math.random() * inc_dico) + 1;
        console.log("getWord send ",line, new Date().getTime(),rowid);
        tx.executeSql(
                'SELECT mot FROM dictionnaire WHERE rowid=?',
                [rowid],
                function (tx, result) {
                    displayWord(line,result.rows.item(0).mot);
                }.bind(line),
                onError
                );
    }.bind(line));
}

function validateWord(tryWord, callback){
     if(inc_dico< dictionnaire.length-1){
         //si le dictionnaire n'est pas encore rempli on valide tout les mots rentré ( temporaire aux premieres parties )
         console.log("check validate word tempory disabled : ",inc_dico,dictionnaire.length-1);
         callback(-1);
         return;
     }
     db.transaction(function (tx) {
        
        tx.executeSql(
                'SELECT count(*) as nb FROM dictionnaire WHERE mot=?',
                [tryWord.toLowerCase()],
                function (tx, result) {
                    callback(result.rows.item(0).nb);
                }.bind(tryWord),
                onError
                );
    }.bind(tryWord));
}
