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
        setTimeout(testTable,200);
        setTimeout(function(){
            getWord(1);
        },300);
        setTimeout(function(){
            getWord(2);
        },400);
        setTimeout(function(){
            getWord(3);
        },450);
        setTimeout(function(){
            getWord(4);
        },500);
        setTimeout(function(){
            getWord(5);
        },550);
        setTimeout(function(){
            getWord(6);
        },600);
    });
}

function onError(e, t) {
    console.error(e, t);
}

function end_loading(){
    //peut etre appellé plusieurs fois a cause des multiples retour asynchrones
    document.getElementById('loading_dico').style.display="none";
    clearInterval(interval_dico);
}

function dicoInserted() {
    var ret = document.getElementById("nb_loaded");
    ret.textContent ="";
    if(inc_dico>=dictionnaire.length-1){
        //plein de retour asynchrone, les en retards on ne les traitent plus
        end_loading();
        return;
    }
    ret.textContent =dictionnaire[inc_dico];
    inc_dico++;
    cookie.set("inc_dico", inc_dico);
}

function fillTable() {

    db.transaction(function (tx) {
        if (inc_dico > dictionnaire.length-1) {
            end_loading();
            //console.log("end_loading");
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
        console.log(dictionnaire[inc_dico],inc_dico);
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
    document.getElementById("nb_loaded").textContent = Math.round(inc_dico/dictionnaire.length*100)+'%';
    interval_dico = setInterval(fillTable, 10);
}


function getWord(line) {
    console.log("getWord call",line, new Date().getTime());
    db.transaction(function (tx) {
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
