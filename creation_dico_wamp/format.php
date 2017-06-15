<?php
$nb=9;
if(!empty($_GET['nb']) ){
 $nb =	$_GET['nb'];
}
$handle = @fopen("mots".$nb."lettres.txt", "r");
if ($handle) {
    while (($buffer = fgets($handle, 4096)) !== false) {
		$words = explode(" ",$buffer);
		foreach($words as $word){
			echo '{"Mot":"'.trim($word).'","Dur":3},<br>';
		}
		
    }
    if (!feof($handle)) {
        echo "Erreur: fgets() a échoué\n";
    }
    fclose($handle);
}
?>