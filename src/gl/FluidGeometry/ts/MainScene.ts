import * as ORE from 'ore-three-ts'
import * as THREE from 'three';
import FluidGeometry from './FluidGeometry';
import NoisePostProcessing from './NoisePostProcessing';

export default class MainScene extends ORE.BaseScene{

	private light: THREE.Light;
	private alight: THREE.Light;

	private screen: THREE.Mesh;
	private raycaster: THREE.Raycaster;

	private touchStart: number;

	private fluidGeometry: FluidGeometry

	private pp: NoisePostProcessing

	constructor(renderer){
		super(renderer);
		this.name = "MainScene";
		this.init();
	}

	init(){
		
        this.light = new THREE.DirectionalLight();
        this.light.position.y = 10;
        this.light.position.z = 10;
		this.scene.add(this.light);

		this.alight = new THREE.AmbientLight();
		this.alight.intensity = 0.5;
		this.scene.add(this.alight);

		this.fluidGeometry = new FluidGeometry( this.renderer );
		this.scene.add(this.fluidGeometry);

		this.pp = new NoisePostProcessing(this.renderer);
		this.pp.addUniform({
			name: 'rotVec',
			value: this.fluidGeometry.mouseVertRotator.scrollVel
		})
		
		let screengeo = new THREE.PlaneGeometry( 15.0, 15.0 );
		let mat = new THREE.MeshNormalMaterial({
			side: THREE.DoubleSide
		});
		mat.visible = false;

		this.screen = new THREE.Mesh( screengeo, mat );
		this.scene.add(this.screen);

		this.raycaster = new THREE.Raycaster();

		this.onResize(window.innerWidth,window.innerHeight);
	}

	animate(){

        var halfWidth = innerWidth / 2;
        var halfHeight = innerHeight / 2;
		var pointer = new THREE.Vector2((this.cursor.position.x - halfWidth) / halfWidth, (this.cursor.position.y - halfHeight) / halfHeight);
		pointer.y *= -1;

        this.raycaster.setFromCamera(pointer, this.camera); 
		var intersects = this.raycaster.intersectObjects([this.screen]);

		let pos = new THREE.Vector2();

		if(intersects.length > 0){

            var point = intersects[0].point;   
			pos.set( ( point.x + 7.5 ) / 15, (point.y + 7.5 ) / 15 );

		}
		

		let vec = new THREE.Vector2( this.cursor.delta.x, -this.cursor.delta.y ).multiplyScalar(1.0);

		this.fluidGeometry.setPointer( pos, vec);
		this.fluidGeometry.update(this.time);

		this.renderer.render(this.scene,this.camera);	
	}

	onResize(width, height) {

		super.onResize(width,height);
		
		let aspect = width / height;
		
		if(aspect > 1.0){
		
			this.camera.position.z = 7;
		
		}else{
		
			this.camera.position.z = 10;
		
		}
		
		this.camera.lookAt(0,-0.0,0);
		this.pp.resize(width,height);
	
	}

    onTouchStart(event:MouseEvent) {
	
		this.touchStart = this.time;
	
	}

    onTouchMove(event:MouseEvent) {
	
		event.preventDefault();
	}

    onTouchEnd(event:MouseEvent) {
		
	}
}