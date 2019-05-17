import * as ORE from 'ore-three-ts'
import * as THREE from 'three';
import Flower from '././Flower';

export default class MainScene extends ORE.BaseScene{
	private box: THREE.Mesh;
	private light: THREE.Light;
	private alight: THREE.Light;
	private flower: Flower;
	private rotator: ORE.ObjectMouseRotator;

	constructor(renderer){
		super(renderer);
		this.name = "MainScene";
		this.init();
	}

	init(){
		this.camera.position.set(0,1.5,3);
		this.camera.lookAt(0,0,0);
		
        this.light = new THREE.DirectionalLight();
        this.light.position.y = 10;
        this.light.position.z = 10;
		this.scene.add(this.light);

		this.alight = new THREE.AmbientLight();
		this.alight.intensity = 0.5;
		this.scene.add(this.alight);

		this.flower = new Flower();
		this.scene.add(this.flower);

		this.rotator = new ORE.ObjectMouseRotator(this.flower);
	}

	animate(){
		this.renderer.render(this.scene,this.camera);
		this.flower.update(this.time);
		this.rotator.update();
	}

	onResize(width, height) {
		super.onResize(width,height);
	}

    onTouchStart(event:MouseEvent) {
		
	}

    onTouchMove(event:MouseEvent) {
		this.rotator.addVelocity(new THREE.Vector2(this.cursor.deltaX,this.cursor.deltaY));
	}

    onTouchEnd(event:MouseEvent) { 
	}
}