import * as THREE from 'three';
import * as ORE from 'ore-three-ts';
import { Mesh, MeshBasicMaterial } from 'three';
import { Blood } from './Blood';

export class Nose extends THREE.Object3D{

	private renderer: THREE.WebGLRenderer;

	private time: number = 0;

	private wireNose: THREE.Mesh;
	private meshNose: THREE.Mesh;

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
		})

		// this.add( this.meshNose );

		/*-------------------------
			Wire
		--------------------------*/

		this.wireNose = ( gltfScene.getObjectByName( 'Nose' ) as Mesh ).clone();
		this.wireNose.scale.set( 1.01, 1.01, 1.01 );
		this.wireNose.material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			wireframe: true,
		});

		// this.add( this.wireNose );

		/*-------------------------
			Blood
		--------------------------*/

		this.blood = new Blood( this.renderer );
		this.add( this.blood );

	}

	public update( deltaTime: number ){

		this.time += deltaTime;

		this.blood.update( deltaTime );

	}

	public splash(){

	}

	public heal(){

	}

}