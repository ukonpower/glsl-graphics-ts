import * as ORE from 'ore-three-ts'
import * as THREE from 'three';

import { Box0 } from './Box0';
import { Box1 } from './Box1';
import { Box2 } from './Box2';
import { Box3 } from './Box3';

export class MainScene extends ORE.BaseScene{

	private renderer: THREE.WebGLRenderer;

	private light: THREE.Light;
	private alight: THREE.Light;

	private boxes: THREE.Object3D[] = [];
	
	private box0: Box0;
	private box1: Box1;
	private box2: Box2;
	private box3: Box3;

	constructor(){
		
		super();
		
		this.name = "MainScene";
	
	}

	onBind( gProps: ORE.GlobalProperties ){
		
		super.onBind( gProps );

		this.renderer = gProps.renderer;

		this.light = new THREE.DirectionalLight();
		this.light.position.y = 10;
		this.light.position.z = 10;
		this.scene.add( this.light );

		this.alight = new THREE.AmbientLight();
		this.alight.intensity = 0.5;
		this.scene.add( this.alight );
		
		this.box0 = new Box0();
		this.boxes.push( this.box0 );
		this.scene.add( this.box0 );

		this.box1 = new Box1();
		this.boxes.push( this.box1 );
		this.scene.add( this.box1 );

		this.box2 = new Box2();
		this.boxes.push( this.box2 );
		this.scene.add( this.box2 );
		
		this.box3 = new Box3();
		this.boxes.push( this.box3 );
		this.scene.add( this.box3 );

		this.switchBox( location.hash );
		
	}

	animate(){
		
		this.box0.update( this.time );
		this.box1.update( this.time );
		this.box2.update( this.time );
		this.box3.update( this.time );
		
		this.renderer.render( this.scene,this.camera );	

	}

	onResize( args: ORE.ResizeArgs ) {

		super.onResize( args );
		
		if( args.aspectRatio > 1.0 ){

			this.camera.position.z = 7;

		}else{

			this.camera.position.z = 10;

		}

		this.camera.lookAt( 0, 0, 0 );

	}

	onTouchStart( cursor: ORE.Cursor, event:MouseEvent ) {

	}

	onTouchMove( cursor: ORE.Cursor, event:MouseEvent ) {

		this.box0.mouseVertRotator.addVelocity( new THREE.Vector2( cursor.delta.x, cursor.delta.y ) );
		this.box1.mouseVertRotator.addVelocity( new THREE.Vector2( cursor.delta.x, cursor.delta.y ) );
		this.box2.mouseVertRotator.addVelocity( new THREE.Vector2( cursor.delta.x, cursor.delta.y ) );
		this.box3.mouseVertRotator.addVelocity( new THREE.Vector2( cursor.delta.x, cursor.delta.y ) );
	
		event.preventDefault();
		
	}

	onTouchEnd( cursor: ORE.Cursor, event:MouseEvent ) { 

	}

	private switchBox( num: string ){

		for( let i = 0; i < this.boxes.length; i++ ){

			this.boxes[ i ].visible = false;
			
		}
		
		switch( num ){
			case '#0':
				this.box0.visible = true;
				break;
			case '#1':
				this.box1.visible = true;
				break;
			case '#2':
				this.box2.visible = true;
				break;
			case '#3':
				this.box3.visible = true;
				break;
			default:
				this.box3.visible = true;
				break;
		}
		
	}

}