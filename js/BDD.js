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
    ret.textContent = Math.floor(inc_dico / (dictionnaire.length - 1) * 100) + '%'+ ' (prise en compte de l\'orthographe à 100%)';
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
    document.getElementById("nb_loaded").textContent = Math.floor(inc_dico/(dictionnaire.length-1)*100)+'%';
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

Array.prototype.getUnique = function() {
 var o = {}, a = [], i, e;
 for (i = 0; e = this[i]; i++) {o[e] = 1};
 for (e in o) {a.push (e)};
 return a;
}

var tab_s = new Array();
var tab_e = new Array();
var nvx_mot = new Array();
function findER(){
    var nb = 0;
    
    
    for (var i=0; i<dictionnaire.length; i++){
        if(dictionnaire[i][5]=="e" && dictionnaire[i][6]=="r"){
            //dictionnaire[i]
            for (var j=0; j<dictionnaire.length; j++){
                if(dictionnaire[i][0] == dictionnaire[j][0] &&
                   dictionnaire[i][1] == dictionnaire[j][1] &&
                   dictionnaire[i][2] == dictionnaire[j][2] &&
                   dictionnaire[i][3] == dictionnaire[j][3] &&
                   dictionnaire[i][4] == dictionnaire[j][4] &&
                   dictionnaire[i][5] == dictionnaire[j][5]
                   ){
                    if(dictionnaire[j][6] == "s"){
                        tab_s.push(dictionnaire[j]);
                    console.log(dictionnaire[i],dictionnaire[j]);
                    }
                    if(dictionnaire[j][6] == "e"){
                        tab_e.push(dictionnaire[j]);
                    }
                }
                
            }
        }
    }
    
    for (var i=0; i<dictionnaire.length; i++){

        if(dictionnaire[i]=="caloyer" || dictionnaire[i]=="atelier" ||
           dictionnaire[i]=="barbier" || dictionnaire[i]=="bouvier" ||
           dictionnaire[i]=="cartier" || dictionnaire[i]=="cellier" ||
           dictionnaire[i]=="cervier" || dictionnaire[i]=="clavier" ||
           dictionnaire[i]=="cuiller" || dictionnaire[i]=="dattier" ||
           dictionnaire[i]=="dentier" || dictionnaire[i]=="dernier" ||
           dictionnaire[i]=="dossier" || dictionnaire[i]=="ebenier" ||
           dictionnaire[i]=="ecolier" || dictionnaire[i]=="encrier" ||
           dictionnaire[i]=="epicier" || dictionnaire[i]=="fermier" ||
           dictionnaire[i]=="fevrier" || dictionnaire[i]=="fichier" ||
           dictionnaire[i]=="figuier" || dictionnaire[i]=="foncier" ||
           dictionnaire[i]=="freezer" || dictionnaire[i]=="glacier" ||
           dictionnaire[i]=="grenier" || dictionnaire[i]=="janvier" ||
           dictionnaire[i]=="lainier" || dictionnaire[i]=="laitier" ||
           dictionnaire[i]=="madrier" || dictionnaire[i]=="metayer" ||
           dictionnaire[i]=="meunier" || dictionnaire[i]=="millier" ||
           dictionnaire[i]=="mortier" || dictionnaire[i]=="olivier" ||
           dictionnaire[i]=="ouvrier" || dictionnaire[i]=="palmier" ||
           dictionnaire[i]=="poirier" || dictionnaire[i]=="pommier" ||
           dictionnaire[i]=="pompier" || dictionnaire[i]=="portier" ||
           dictionnaire[i]=="premier" || dictionnaire[i]=="prunier" ||
           dictionnaire[i]=="routier" || dictionnaire[i]=="sentier" ||
           dictionnaire[i]=="skipper" || dictionnaire[i]=="sorcier" ||
           dictionnaire[i]=="soulier" || dictionnaire[i]=="speaker" ||
           dictionnaire[i]=="sucrier" || dictionnaire[i]=="tablier" ||
           dictionnaire[i]=="terrier" || dictionnaire[i]=="verdier" ||
           dictionnaire[i]=="voilier" || dictionnaire[i]=="usurier" ||
           dictionnaire[i]=="herbier" || dictionnaire[i]=="usurier" ||
           
           dictionnaire[i]=="collier" || dictionnaire[i]=="cordier"
           ){
            continue;
        }
        
        if(dictionnaire[i][5]=="e" && dictionnaire[i][6]=="r"){
  
            var motS = dictionnaire[i][0]+dictionnaire[i][1]+dictionnaire[i][2]+dictionnaire[i][3]+dictionnaire[i][4]+dictionnaire[i][5]+"s";
            if(tab_s.indexOf(motS)==-1){
                nvx_mot.push(motS);
            }
            var motE = dictionnaire[i][0]+dictionnaire[i][1]+dictionnaire[i][2]+dictionnaire[i][3]+dictionnaire[i][4]+dictionnaire[i][5]+"e";
            if(tab_e.indexOf(motE)==-1){
                if(dictionnaire[i]=="charter" || dictionnaire[i] =="gaucher" || dictionnaire[i] =="gravier" || dictionnaire[i] =="voyager"){
                    continue;
                }
                nvx_mot.push(motE);
            }
        }
    }
    
    document.getElementById("version").innerHTML = '"'+nvx_mot.join('","')+'"';

    console.log(tab_s,tab_e,nvx_mot);
}

for (var i=0; i<dictionnaire.length; i++){
    if(dictionnaire[i].length !=7) console.error("erreur dico !!!",dictionnaire[i]);
    
}