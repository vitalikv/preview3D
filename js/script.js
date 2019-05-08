
var container = document.getElementById( 'container' );

var containerStyle = getComputedStyle(container,null);
var w_w = parseInt(containerStyle.getPropertyValue('width'));
var w_h = parseInt(containerStyle.getPropertyValue('height'));


var renderer = new THREE.WebGLRenderer( /*{antialias : true}*/ );
renderer.localClippingEnabled = true;
//renderer.autoClear = false;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( w_w, w_h );
//renderer.setClearColor (0xffffff, 1);
//renderer.setClearColor (0x9c9c9c, 1);
container.appendChild( renderer.domElement );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );




//----------- camera3D
var camera3D = new THREE.PerspectiveCamera( 65, w_w / w_h, 0.2, 1000 );  
camera3D.rotation.order = 'YZX';		//'ZYX'
camera3D.position.set(-2, 1.3, -2);
camera3D.lookAt(scene.position);
camera3D.rotation.z = 0;
camera3D.userData.camera = { type : 'fly', height : camera3D.position.y, startProject : true };
//----------- camera3D






//----------- Light 
scene.add( new THREE.AmbientLight( 0xffffff, 0.7 ) ); 


var directionalLight = new THREE.DirectionalLight( 0xcccccc, 0.3 );
//var directionalLight = new THREE.PointLight( 0xffffff, 0.5 );
//directionalLight.castShadow = true;
directionalLight.position.set(-5,6,5);
directionalLight.lookAt(scene.position);
//----------- Light



var cube = new THREE.Mesh( createGeometryCube(1.07, 1.07, 1.07), new THREE.MeshLambertMaterial( { color : 0x030202, transparent: true, opacity: 1, depthTest: false } ) );
//scene.add( cube ); 



//----------- onWindowResize
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() 
{ 
	var aspect = w_w / w_h;
	var d = 5;

	camera3D.aspect = aspect;
	camera3D.updateProjectionMatrix();	
	
	renderer.setSize(w_w, w_h);
}
//----------- onWindowResize






//----------- start







var camera = camera3D;
var type_browser = detectBrowser();
var planeMath = createPlaneMath();
createGrid();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var arrPop = [];  


	
//----------- start


document.body.addEventListener('contextmenu', function(event) { event.preventDefault() });
document.body.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.body.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.body.addEventListener( 'mouseup', onDocumentMouseUp, false );
document.addEventListener('DOMMouseScroll', mousewheel, false);
document.addEventListener('mousewheel', mousewheel, false);



function createGrid()
{
	var geom_line = new THREE.Geometry();
	var count_grid1 = 100;
	var count_grid2 = (count_grid1 * 0.5) / 2;
	geom_line.vertices.push(new THREE.Vector3( - count_grid2, 0, 0 ) );
	geom_line.vertices.push(new THREE.Vector3( count_grid2, 0, 0 ) );
	linesMaterial = new THREE.LineBasicMaterial( { color: 0xd6d6d6, opacity: .2, linewidth: .1 } );

	for ( var i = 0; i <= count_grid1; i ++ ) 
	{
		var line = new THREE.Line( geom_line, linesMaterial );
		line.position.z = ( i * 0.5 ) - count_grid2;
		line.position.y = -0.01;
		scene.add( line );

		var line = new THREE.Line( geom_line, linesMaterial );
		line.position.x = ( i * 0.5 ) - count_grid2;
		line.position.y = -0.01;
		line.rotation.y = 90 * Math.PI / 180;
		scene.add( line );
	}	
}


function createPlaneMath()
{
	var geometry = new THREE.PlaneGeometry( 10000, 10000 );
	var mat_pm = new THREE.MeshLambertMaterial( {color: 0xffff00, transparent: true, opacity: 0, side: THREE.DoubleSide } );
	mat_pm.visible = false; 
	var planeMath = new THREE.Mesh( geometry, mat_pm );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.userData.tag = 'planeMath';	
	scene.add( planeMath );	
	
	return planeMath;
}


function createGeometryCube(x, y, z)
{
	var geometry = new THREE.Geometry();
	x /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(-x,0,z),
				new THREE.Vector3(-x,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,0,z),
				new THREE.Vector3(x,0,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(-x,y,-z),
				new THREE.Vector3(-x,0,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	return geometry;
}


function createGeometryWD(x, y, z) 
{
	var geometry = new THREE.Geometry();
	x /= 2;
	y /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(-x,-y,z),
				new THREE.Vector3(-x,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,-y,z),
				new THREE.Vector3(x,-y,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(-x,y,-z),
				new THREE.Vector3(-x,-y,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	return geometry;
}




var onMouseDownPosition = new THREE.Vector2();
var radious = 10, theta = 90, onMouseDownTheta = 0, phi = 75, onMouseDownPhi = 75;
var centerCam = new THREE.Vector3( 0, 0, 0 );
var cam3dDir = new THREE.Vector3( 1, 0, 0 );
var isMouseDown2 = false;
var isMouseDown3 = false;


function onDocumentMouseDown( event )
{
	switch ( event.button ) 
	{
		case 0: isMouseDown2 = true; break;
		case 1: /*middle*/ break;
		case 2: isMouseDown3 = true; break;
	}

	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;	
	
	if ( isMouseDown2 )				// 1
	{
		//var dir = camera.getWorldDirection();
		var dir = new THREE.Vector3().subVectors( centerCam, camera.position ).normalize();
		
		// получаем угол наклона камеры к target (к точке куда она смотрит)
		var dergree = THREE.Math.radToDeg( dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z)) ) * 2;	
		if(dir.y > 0) { dergree *= -1; }
		phi = dergree;  	
		
		
		// получаем угол направления (на плоскости) камеры к target 
		dir.y = 0; 
		dir.normalize();    
		theta = THREE.Math.radToDeg( Math.atan2(dir.x, dir.z) - Math.PI ) * 2;	
		
		
		onMouseDownTheta = theta;
		onMouseDownPhi = phi;
	}
	else if ( isMouseDown3 )		// 2
	{
		planeMath.position.copy( centerCam );
		planeMath.rotation.copy( camera.rotation );
		planeMath.updateMatrixWorld();

		var v = planeMath.geometry.vertices;
		var v1 = planeMath.localToWorld( v[ 0 ].clone() );
		var v2 = planeMath.localToWorld( v[ 2 ].clone() );
		cam3dDir = new THREE.Vector3().subVectors( v2, v1 ).normalize();
	}	
}


function onDocumentMouseMove( event )
{
	if ( isMouseDown2 ) 
	{  
		radious = centerCam.distanceTo( camera.position );
		theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + onMouseDownTheta;
		phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + onMouseDownPhi;
		phi = Math.min( 180, Math.max( -80, phi ) );

		camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
		camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
		camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

		camera.position.add( centerCam );  
		camera.lookAt( centerCam );
	}
	
	if ( isMouseDown3 )    
	{
		var mouseY = ( ( event.clientX - onMouseDownPosition.x ) * 0.01 );
		var mouseX = ( ( event.clientY - onMouseDownPosition.y ) * 0.01 );

		onMouseDownPosition.x = event.clientX;
		onMouseDownPosition.y = event.clientY;

		var pos2 = camera.position.clone();


		var dir = new THREE.Vector3().addScaledVector( cam3dDir, -mouseX );
		camera.position.add( dir.addScalar( 0.001 ) );


		var x1 = camera.position.z - centerCam.z;
		var z1 = centerCam.x - camera.position.x;
		dir = new THREE.Vector3( x1, 0, z1 ).normalize();        // dir (перпендикуляр стены)   
		dir = new THREE.Vector3().addScaledVector( dir, -mouseY );
		camera.position.add( dir.addScalar( 0.001 ) );

		centerCam.add( new THREE.Vector3( camera.position.x - pos2.x, camera.position.y - pos2.y, camera.position.z - pos2.z ) );
	}			
}


function onDocumentMouseUp( event )
{
	isMouseDown2 = false;
	isMouseDown3 = false;
}




function mousewheel( e )
{
	var delta = e.wheelDelta ? e.wheelDelta / 120 : e.detail ? e.detail / 3 : 0;

	if ( type_browser == 'Chrome' || type_browser == 'Opera' ) { delta = -delta; }

	var vect = ( delta < 0 ) ? 1 : -1;

	var pos2 = camera.position.clone();

	var dir = new THREE.Vector3().subVectors( centerCam, camera.position ).normalize();
	dir = new THREE.Vector3().addScaledVector( dir, vect );
	dir.addScalar( 0.001 );
	var pos3 = new THREE.Vector3().addVectors( camera.position, dir );


	var offset = new THREE.Vector3().subVectors( pos3, pos2 );
	var pos2 = new THREE.Vector3().addVectors( centerCam, offset );

	if ( delta < 0 ) { if ( pos2.y >= 0 ) { centerCam.copy( pos2 ); } }

	if ( pos3.distanceTo( centerCam ) >= 0.15 ) { camera.position.copy( pos3 ); }
}



	 

//https://catalog.planoplan.com/lots/search/?keys[0]=92da6c1f72c1ebca456a86d978af1dfc7db1bcb24d658d710c5c8ae25d98ba52&id[0]=9337&lang=ru
//https://catalog.planoplan.com/api/v2/search/?keys[0]=fb5f95f84fa11b73e0ebfa0969de65176902c1b7337652d43537a66a09d7028d&id[0]=13256&lang=ru



function detectBrowser()
{
	var ua = navigator.userAgent;

	if ( ua.search( /MSIE/ ) > 0 ) return 'Explorer';
	if ( ua.search( /Firefox/ ) > 0 ) return 'Firefox';
	if ( ua.search( /Opera/ ) > 0 ) return 'Opera';
	if ( ua.search( /Chrome/ ) > 0 ) return 'Chrome';
	if ( ua.search( /Safari/ ) > 0 ) return 'Safari';
	if ( ua.search( /Konqueror/ ) > 0 ) return 'Konqueror';
	if ( ua.search( /Iceweasel/ ) > 0 ) return 'Debian';
	if ( ua.search( /SeaMonkey/ ) > 0 ) return 'SeaMonkey';

	// Браузеров очень много, все вписывать смысле нет, Gecko почти везде встречается
	if ( ua.search( /Gecko/ ) > 0 ) return 'Gecko';

	// а может это вообще поисковый робот
	return 'Search Bot';
}



function animate() 
{
	requestAnimationFrame( animate );	
	renderer.render(scene, camera);
}

animate();

