var db;
var check_inc = cookie.get("inc_dico");
if (check_inc) {
    inc_dico = parseInt(check_inc);
}
inc_dico++;

db = openDatabase('bdd', '', 'database', 5 * 1024 * 1024);
console.log('opendatabase send at  ',new Date().getTime());
var interval_checkdb = setInterval(function(){
    if (db){
        console.log('opendatabase opened at',new Date().getTime());
        clearInterval(interval_checkdb);
        init();
    }
},1);
//console.log('si on met une instruction db.transaction ici, db à de forte chance de ne pas encore existé, à ce temps là: ',new Date().getTime());

function init(){
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS dictionnaire\n\
                             (mot VARCHAR)');
        setTimeout(testTable,200);
        setTimeout(displayGame,2000);
    });
}

function onError(e, t) {
    console.error(e, t);
}

function dicoInserted() {
    document.getElementById("nb_loaded").textContent = dictionnaire[inc_dico];
    inc_dico++;
}

function fillTable() {
    if (inc_dico >= dictionnaire.length) {
        clearInterval(interval_dico);
    }
    db.transaction(function (tx) {
        cookie.set("inc_dico", inc_dico);
        tx.executeSql(
            'INSERT INTO dictionnaire (mot) VALUES (?)',
            [dictionnaire[inc_dico]],
            dicoInserted,
            onError
        );
    });
}

function tableCreate() {
    console.log("debut remplissage table",new Date());
    document.getElementById('loading_dico').style.display = "block";
    document.getElementById("nb_loaded").textContent = Math.round(inc_dico/dictionnaire.length*100)+'%';

    interval_dico = setInterval(fillTable, 100);
}


function getWord(rowid) {
    db.transaction(function (tx) {
        tx.executeSql(
                'SELECT mot FROM dictionnaire WHERE rowid=?',
                [rowid],
                function (tx, result) {
                    displayWord(result.rows.item(0).mot);
                },
                onError
                );
    });
}
