import vert from './shaders/box0.vs';
import frag from './shaders/box0.fs';

import * as THREE from 'three';
import * as ORE from 'ore-three-ts';
import { Vector2 } from 'three';
import { MouseVertexRotator } from '../MouseVertexRotator';

export class Box0 extends THREE.Object3D{

	private uni: ORE.Uniforms;
	public mouseVertRotator: MouseVertexRotator;

	constructor() {

		super();
		
		this.createMesh();
		
	}

	createMesh() {

		let geo = new THREE.BoxBufferGeometry( 2, 2, 2 );
		
		let cUni = {
			time: {
				value: 0
			}
		}

		this.uni = THREE.UniformsUtils.merge( [ THREE.ShaderLib.standard.uniforms, cUni ] );
		this.uni.roughness.value = 0.8;

		let mat = new THREE.ShaderMaterial( {
			vertexShader: vert,
			fragmentShader: frag,
			uniforms: this.uni,
			flatShading: true,
			lights: true,
			side: THREE.DoubleSide
		} )

		let box = new THREE.Mesh( geo, mat )

		this.mouseVertRotator = new MouseVertexRotator( box, this.uni );
		
		this.add( box );
		
	}

	update( time: number ) {
		
		this.uni.time.value = time;

		this.mouseVertRotator.update();
		
	}
	
}