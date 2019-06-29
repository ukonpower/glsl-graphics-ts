import * as ORE from 'ore-three-ts'
import * as THREE from 'three';
import { Dandelion } from './Dandelion';

export class DandelionScene extends ORE.BaseScene{

	private renderer: THREE.WebGLRenderer;

	private dandeilon: Dandelion;

	constructor(){

		super();

		this.name = "DandelionScene";
	
	}

	onBind( gPorps: ORE.GlobalProperties ){

		super.onBind( gPorps );

		this.renderer = this.gProps.renderer;
		
		this.camera.position.set( 0, 1.5 ,3 );
		this.camera.lookAt( 0, 0, 0 );
		
        let light = new THREE.DirectionalLight();
        light.position.y = 10;
		this.scene.add( light );

		let alight = new THREE.AmbientLight();
		this.scene.add( alight );

		this.dandeilon = new Dandelion( this.renderer );
		this.scene.add( this.dandeilon );

	}

	animate( deltaTime: number ){

		this.dandeilon.update( deltaTime );
		
		this.renderer.render( this.scene, this.camera );
	
	}

	onResize( width: number, height: number ) {
	
		super.onResize( width, height );
	
	}

    onTouchStart( cursor: ORE.Cursor, event: MouseEvent ) {

	}

    onTouchMove( cursor: ORE.Cursor, event: MouseEvent ) {

	}

	onTouchEnd( cursor: ORE.Cursor, event: MouseEvent ) {

	}
	
	onHover( cursor: ORE.Cursor ) {

	}

}