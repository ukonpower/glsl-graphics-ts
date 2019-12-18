import vert from './shaders/box3.vs';
import frag from './shaders/box3.fs';

import * as THREE from 'three';
import * as ORE from 'ore-three-ts';
import { Vector2 } from 'three';
import { MouseVertexRotator } from '../MouseVertexRotator';

export class Box3 extends THREE.Object3D{
	private uni: any;
	private size: THREE.Vector2;
	private num:number;
	public mouseVertRotator: MouseVertexRotator;

	constructor() {

		super();
		
		this.num = 10;
		this.size = new THREE.Vector2( 1,1 );

		this.createMesh();
		
	}

	createMesh() {
		
		let originBox = new THREE.BoxBufferGeometry( 0.15, 0.15, 0.15, 30 );
		let geo = new THREE.InstancedBufferGeometry();

		let vertice = ( originBox.attributes.position as THREE.BufferAttribute ).clone();
		geo.addAttribute( 'position', vertice );

		let normal = ( originBox.attributes.normal as THREE.BufferAttribute ).clone();
		geo.addAttribute( 'normals', normal );

		let uv = ( originBox.attributes.normal as THREE.BufferAttribute ).clone();
		geo.addAttribute( 'uv', uv );

		let indices = originBox.index.clone();
		geo.setIndex( indices );

		let posArray = [];
		let numArray = [];

		let cnt = 0;
		
		for ( let i = 0; i < this.num; i++ ) {

			for ( let j = 0; j < this.num; j++ ) {
				
				for ( let k = 0; k < this.num; k++ ) {

					let x = ( i - ( this.num - 1 ) / 2 ) * 0.25;
					let y = ( j - ( this.num - 1 ) / 2 ) * 0.25;
					let z = ( k - ( this.num - 1 ) / 2 ) * 0.25;

					posArray.push( x, y, z );

					numArray.push( cnt++ );

				}
			}
		}

		let offsetPos = new THREE.InstancedBufferAttribute( new Float32Array( posArray ), 3 );
		let num = new THREE.InstancedBufferAttribute( new Float32Array( numArray ), 1 );

		geo.addAttribute( 'offsetPos', offsetPos );
		geo.addAttribute( 'num', num );

		let cUni = {
			time: {
				value: 0
			},
			all: {
				value: this.num
			}
		}

		this.uni = THREE.UniformsUtils.merge( [THREE.ShaderLib.standard.uniforms, cUni] );
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

		this.mouseVertRotator = new MouseVertexRotator( box,this.uni );
		
		this.add( box );
		
	}

	update( time: number ) {
		
		this.uni.time.value = time;
		this.mouseVertRotator.update();
		
	}
	
}