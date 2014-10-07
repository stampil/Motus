var db;
var check_inc = cookie.get("inc_dico");
if (check_inc) {
    inc_dico = parseInt(check_inc);
}
inc_dico++;
if (window.openDatabase) {
    db = openDatabase('bdd', '', 'database', 5 * 1024 * 1024, function (db) {
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS dictionnaire\n\
                             (word VARCHAR)');
        });
    });
}

function onError(e, t) {
    console.error(e, t);
}
function dicoInserted() {
    document.getElementById("nb_loaded").textContent = ++inc_dico;
}
function getWord(rowid) {
    console.info("getWord("+rowid+")");
    db.transaction(function (tx) {
        tx.executeSql(
                'SELECT word FROM dictionnaire WHERE rowid=?',
                [rowid],
                function (tx, result) {
                    displayWord(result.rows.item(0).word);
                },
                onError
                );
    });
}

function fillTable() {
    if (inc_dico >= dictionnaire.length) {
        clearInterval(interval_dico);
    }
    db.transaction(function (tx) {

        cookie.set("inc_dico", inc_dico);
        console.log(dictionnaire.length, inc_dico);
        tx.executeSql(
                'INSERT INTO dictionnaire (word) VALUES (?)',
                [dictionnaire[inc_dico]],
                dicoInserted,
                onError
                );
    });
}

function tableCreate() {
    console.log('table created');
    document.getElementById('loading_dico').style.display = "block";
    document.getElementById("total_to_load").textContent = dictionnaire.length;

    interval_dico = setInterval(fillTable, 500);
}

