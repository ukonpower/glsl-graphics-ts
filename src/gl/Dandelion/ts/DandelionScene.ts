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

	constructor(){

		super();

		this.name = "DandelionScene";
	
	}

	onBind( gPorps: ORE.GlobalProperties ){

		super.onBind( gPorps );

		this.renderer = this.gProps.renderer;

		this.micData = new MicData( window.navigator, 256 );
		
		this.camera.position.set( 2, 4 ,5 );
		this.camera.lookAt( 0, 1.5, 0 );
		
        let light = new THREE.DirectionalLight();
        light.position.y = 10;
		this.scene.add( light );

		let alight = new THREE.AmbientLight();
		this.scene.add( alight );

		this.dandeilon = new Dandelion( this.renderer );
		this.scene.add( this.dandeilon );

		this.floor = new Floor();
		this.scene.add( this.floor );

	}

	animate( deltaTime: number ){

		this.dandeilon.update( deltaTime );

		this.dandeilon.addBreath( this.micData.volume * 0.001);
		
		this.renderer.render( this.scene, this.camera );
	
	}

	onResize( width: number, height: number ) {
	
		super.onResize( width, height );
	
	}

    onTouchStart( cursor: ORE.Cursor, event: MouseEvent ) {

	}

    onTouchMove( cursor: ORE.Cursor, event: MouseEvent ) {

		this.dandeilon.addBreath( cursor.delta.y * -0.001 );

	}

	onTouchEnd( cursor: ORE.Cursor, event: MouseEvent ) {

	}
	
	onHover( cursor: ORE.Cursor ) {

	}

}