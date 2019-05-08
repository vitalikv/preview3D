<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Webgl-editor</title> 
  

	
</head>

<body>

	<div id="container" style="width: 1400px; height: 800px; border: 1px solid;"></div>
	<?php $vrs = '=1' ?>
	
    <script>
	var vr = "<?=$vrs ?>";
	console.log('version '+ vr);
      
    </script>
    <script src="js/three.min.js?<?=$vrs?>"></script>
    <script src="js/jquery.js"></script>
    <script src="js/script.js?<?=$vrs?>"></script>
	<script src="js/loadPopObj.js?<?=$vrs?>"></script>
	<script src="js/createParamWD.js?<?=$vrs?>"></script>
	<script src="js/changeTexture.js?<?=$vrs?>"></script>
	
    <script>
	var libs = '92da6c1f72c1ebca456a86d978af1dfc7db1bcb24d658d710c5c8ae25d98ba52';  
	//var libs = 'fb5f95f84fa11b73e0ebfa0969de65176902c1b7337652d43537a66a09d7028d';
	
	loadPopObj_1( { lotid : 25 } );      
    </script>	
</body>

</html>