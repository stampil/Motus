var inc_dico=0;
var interval_dico=null;
var dictionnaire=null;
var dictionnaire_dur =null;
var db;
var check_inc =null;
var interval_checkdb =null;
var declenchement_super_parti = 7;
var decompte_super_parti = declenchement_super_parti;
var nb_essai_partie_normale = 6;
var nb_essai_super_partie = 2;
var super_partie_faite=0;
var super_partie_trouve=0;
var is_super_partie=false;
var nb_essai = nb_essai_partie_normale;
var last_insert = false;
var toFind ="";
var tryWord="";
var goodKey = new Array();
var nb_reussite_total=0;
var nb_reussite=0;
var nb_game=0;
var letter_checked=new Array();
var real ={"width":0,"height":0};
var lengthWord=-1;
var version="4.0.1";
var is_mobile=false;
var nb_joker=0;

var C=2;
var L=1;

var beepCheck;
var beepError;
var beepGood;
var beepNotHere;
var clap;
var boo;
var gasp;