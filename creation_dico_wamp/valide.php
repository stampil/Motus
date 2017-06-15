<script>
function valide(i){
	var val = parseInt(document.getElementById('value_'+i).innerHTML);
	if(val == 1){
		document.getElementById('value_'+i).innerHTML=3;
		document.getElementById('div_'+i).style.color="black";
	}
	else{
		document.getElementById('value_'+i).innerHTML=1;
		document.getElementById('div_'+i).style.color="green";
	}
}
</script>


<?php
$nb=9;
if(!empty($_GET['nb']) ){
 $nb =	$_GET['nb'];
}
$handle = @fopen("validation".$nb.".txt", "r");
$line =0;
if ($handle) {
    while (($buffer = fgets($handle, 4096)) !== false) {
		$line++;
		preg_match('/{"Mot":"([A-Z]+)","Dur":([1-4])},/',$buffer,$words);

		echo '<div onclick="valide('.$line.')" id="div_'.$line.'" '.($words[2]==1?'style="color:green"':'').'>{"Mot":"'.$words[1].'","Dur":<span id="value_'.$line.'">'.$words[2].'</span>},</div>';		
    }
    if (!feof($handle)) {
        echo "Erreur: fgets() a échoué\n";
    }
    fclose($handle);
}
?>
