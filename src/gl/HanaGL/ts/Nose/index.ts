import * as THREE from 'three';
import * as ORE from 'ore-three-ts';
import { Mesh, MeshBasicMaterial } from 'three';
import { Blood } from './Blood';

export class Nose extends THREE.Object3D{

	private renderer: THREE.WebGLRenderer;

	private time: number = 0;

	private wireNose: THREE.Mesh;
	private meshNose: THREE.Mesh;

	private leftPoint: THREE.Object3D;
	private rightPoint: THREE.Object3D;

	private blood: Blood;

	constructor( renderer: THREE.WebGLRenderer, gltfScene: THREE.Scene ){

		super();

		this.renderer = renderer;

		this.craeteObjects( gltfScene );

	}

	private craeteObjects( gltfScene: THREE.Scene ){

		/*-------------------------
			Mesh
		--------------------------*/
		
		this.meshNose = ( gltfScene.getObjectByName( 'Nose' ) as Mesh ).clone();
		this.meshNose.material = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			roughness: 0.9,
			opacity: 1.0,
			transparent: true
		})

		this.add( this.meshNose );

		/*-------------------------
			Wire
		--------------------------*/

		this.wireNose = ( gltfScene.getObjectByName( 'Nose' ) as Mesh ).clone();
		this.wireNose.scale.set( 1.01, 1.01, 1.01 );
		this.wireNose.material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			wireframe: true,
		});

		this.add( this.wireNose );

		/*-------------------------
			Positions
		--------------------------*/

		this.rightPoint = ( this.meshNose.getObjectByName( 'splash_right' ) as Mesh );
		this.leftPoint = ( this.meshNose.getObjectByName( 'splash_left' ) as Mesh );


		/*-------------------------
			Blood
		--------------------------*/

		this.blood = new Blood( this.renderer );
		this.meshNose.add( this.blood );

		this.splash();

	}

	public update( deltaTime: number ){

		this.time += deltaTime;

		this.blood.update( deltaTime );

	}

	public splash(){

		this.blood.splash( this.rightPoint.position );

	}

	public heal(){

	}

}