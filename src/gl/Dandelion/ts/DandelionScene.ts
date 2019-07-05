import * as ORE from 'ore-three-ts'
import * as THREE from 'three';
import { Dandelion } from './Dandelion';
import Floor from './Floor';
import MicData from './MicData';

export class DandelionScene extends ORE.BaseScene{

	private renderer: THREE.WebGLRenderer;

	private dandeilon: Dandelion;

	private micData: MicData;

	private floor: Floor;

	private bloom: ORE.BloomFilter;

	private breatFinger = 0.0;

	constructor(){

		super();

		this.name = "DandelionScene";
	
	}

	onBind( gPorps: ORE.GlobalProperties ){

		super.onBind( gPorps );

		this.renderer = this.gProps.renderer;

		// this.scene.background = new THREE.Color( 0xffffff );
		// this.scene.fog = new THREE.Fog( 0xffffff, 3, 20);
		this.micData = new MicData( window.navigator, 256 );
		
		this.camera.position.set( 2, 4 ,5 );
		this.camera.lookAt( 0, 1.5, 0 );
		
        let light = new THREE.DirectionalLight();
        light.position.y = 10;
        // light.position.z = 10;
		this.scene.add( light );

		let alight = new THREE.AmbientLight();
		this.scene.add( alight );

		// let plight = new THREE.PointLight();
		// this.scene.add( plight );

		this.dandeilon = new Dandelion( this.renderer );
		this.scene.add( this.dandeilon );

		this.floor = new Floor();
		this.floor.position.y = -0.1;
		this.scene.add( this.floor );

		this.bloom = new ORE.BloomFilter( this.renderer );
		this.bloom.threshold = 0.1;
		this.bloom.brightness = 1.0;		

	}

	animate( deltaTime: number ){

		this.breatFinger *= 0.97;

		this.dandeilon.update( deltaTime );

		this.dandeilon.addBreath( this.micData.volume * 0.0005 + this.breatFinger);

		this.floor.update( this.time );

		this.dandeilon.rotateY( 0.01 );
		
		// this.bloom.render( this.scene, this.camera );
		this.renderer.render( this.scene, this.camera );
	
	}

	onResize( width: number, height: number ) {
	
		super.onResize( width, height );

		this.bloom.resize( this.width, this.height );
	
	}

    onTouchStart( cursor: ORE.Cursor, event: MouseEvent ) {

	}

    onTouchMove( cursor: ORE.Cursor, event: MouseEvent ) {

		this.breatFinger += cursor.delta.y * -0.0001;

	}

	onTouchEnd( cursor: ORE.Cursor, event: MouseEvent ) {

	}
	
	onHover( cursor: ORE.Cursor ) {

	}

}