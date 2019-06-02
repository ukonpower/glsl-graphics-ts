import * as ORE from 'ore-three-ts'
import * as THREE from 'three';
import Flower from './Flower';
export default class MainScene extends ORE.BaseScene{
	private light: THREE.Light;
	private alight: THREE.Light;
	private box: THREE.Object3D;

	private touchStart: number;

	private some: Flower

	constructor(renderer){
		super(renderer);
		this.name = "MainScene";
		this.init();
	}

	init(){
		this.onResize(window.innerWidth,window.innerHeight);
		
        this.light = new THREE.DirectionalLight();
        this.light.position.y = 10;
        this.light.position.z = 10;
		this.scene.add(this.light);

		this.alight = new THREE.AmbientLight();
		this.alight.intensity = 0.5;
		this.scene.add(this.alight);

		this.some = new Flower();
		this.scene.add(this.some);
	}

	animate(){
		this.some.update(this.time);
		this.renderer.render(this.scene,this.camera);		
	}

	onResize(width, height) {
		super.onResize(width,height);
		let aspect = width / height;
        if(aspect > 1.0){
            this.camera.position.z = 3;
        }else{
            this.camera.position.z = 5;
		}
		this.camera.lookAt(0,-0.0,0);
	}

    onTouchStart(event:MouseEvent) {
		this.touchStart = this.time;
	}

    onTouchMove(event:MouseEvent) {

		this.some.mouseVertRotator.addVelocity(new THREE.Vector2(this.cursor.deltaX,this.cursor.deltaY));
	
	}

    onTouchEnd(event:MouseEvent) { 
	}
}