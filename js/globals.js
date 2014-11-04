var inc_dico=0;
var interval_dico=null;
var dictionnaire=null;
var dictionnaire_dur =null;
var db;
var check_inc =null;
var interval_checkdb =null;
var nb_essai = 6;
var last_insert = false;
var toFind ="";
var tryWord="";
var goodKey = new Array();
var nb_reussite=0;
var nb_game=0;
var letter_checked=new Array();
var real ={"width":0,"height":0};
var lengthWord=-1;
var version="1.4.4";


var context;
var bufferLoader;
var BUFFER;

var C=2;
var L=1;

var beepGood=0;
var beepCheck=1;
var beepError=2;
var beepNotHere=3;
