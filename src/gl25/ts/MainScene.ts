import * as ORE from 'ore-three-ts'
import * as THREE from 'three';

import Flower from './Flower';
import NoisePostProcessig from './NoisePostProcessing';

import bgFrag from './shaders/bg.fs';

export default class MainScene extends ORE.BaseScene{
	private light: THREE.Light;
	private alight: THREE.Light;
	private flower: Flower;
	private rotator: ORE.MouseRotator;

	private npp: NoisePostProcessig;
	private uni: any;
	private bg: ORE.Background;

	constructor(renderer){
		super(renderer);
		this.name = "MainScene";
		this.init();
	}

	init(){
		this.onResize(window.innerWidth,window.innerHeight);
		
		// this.camera.position.y = 1.0;
		// this.camera.lookAt(0,-0.1,0);
		
        this.light = new THREE.DirectionalLight();
        this.light.position.y = 10;
        this.light.position.z = 10;
		this.scene.add(this.light);

		this.alight = new THREE.AmbientLight();
		this.alight.intensity = 0.5;
		this.scene.add(this.alight);

		this.flower = new Flower();
		this.scene.add(this.flower);

		this.rotator = new ORE.MouseRotator(this.flower);

		this.npp = new NoisePostProcessig(this.renderer);

		this.uni = {
			time: {
				value: 0
			}
		}
		
		this.bg = new ORE.Background(bgFrag,this.uni);
		this.scene.add(this.bg);
	}

	animate(){
		this.flower.update(this.time);
		this.rotator.update();

		this.npp.update(this.time);
		this.npp.render(this.scene,this.camera);
		this.camera.updateProjectionMatrix();
	}

	onResize(width, height) {
		super.onResize(width,height);

		let aspect = width / height;
        if(aspect > 1.0){
            this.camera.position.z = 3;
        }else{
            this.camera.position.z = 6;
		}
		this.camera.lookAt(0,-0.1,0);
	}

    onTouchStart(event:MouseEvent) {
		
	}

    onTouchMove(event:MouseEvent) {
		this.rotator.addVelocity(new THREE.Vector2(this.cursor.deltaX,this.cursor.deltaY));
	}

    onTouchEnd(event:MouseEvent) { 
	}
}