import * as THREE from 'three';
import * as ORE from 'ore-three-ts';

import vert from './shaders/dandelion.vs';
import frag from './shaders/dandelion.fs';

declare interface Kernels{
	position: ORE.GPUComputationKernel;
	velocity: ORE.GPUComputationKernel;
}

declare interface Datas{
	position: ORE.GPUcomputationData;
	velocity: ORE.GPUcomputationData;
}

export class Dandelion extends THREE.Object3D{

	private renderer: THREE.WebGLRenderer;

	//gpgpu
	private gcController: ORE.GPUComputationController;
	private kernels: Kernels;
	private datas: Datas;

	//mesh
	private uni: ORE.Uniforms;
	private num: number;

	constructor( renderer: THREE.WebGLRenderer ){
		
		super();

		this.renderer = renderer;

		this.createFluff();

	}

	private createFluff(){

		//position
		let sphere = new THREE.SphereBufferGeometry( 1.0, 10, 10 );
		let spherePos = sphere.attributes.position.array;
		this.num = spherePos.length;
		

		this.gcController = new ORE.GPUComputationController( this.renderer, new THREE.Vector2( this.num, this.num ));
		this.kernels = {
			position: this.gcController.createKernel( '' ),
			velocity: this.gcController.createKernel( '' ),
		}

		this.datas = {
			position: this.gcController.createData(),
			velocity: this.gcController.createData(),
		}

		let geo = new THREE.InstancedBufferGeometry();
		

		//copy original mesh
		let fluffMesh = new THREE.BoxBufferGeometry( 0.1, 0.1, 0.1 );

        let vertice = ( fluffMesh.attributes.position as THREE.BufferAttribute).clone();
        geo.addAttribute( 'position', vertice );

        let normal = ( fluffMesh.attributes.normal as THREE.BufferAttribute ).clone();
        geo.addAttribute( 'normals', normal );

        let uv = ( fluffMesh.attributes.normal as THREE.BufferAttribute ).clone();
        geo.addAttribute( 'uv', uv );

        let indices = fluffMesh.index.clone();
		geo.setIndex( indices );


        let offsetPos = new THREE.InstancedBufferAttribute( spherePos, 3, false );
        let num = new THREE.InstancedBufferAttribute( new Float32Array(this.num * 1), 1, false, 1 );

        for (let i = 0; i < this.num; i++) {
            num.setX(i, i);
        }

        geo.addAttribute('offsetPos', offsetPos);
        geo.addAttribute('num', num);

        let cUni = {
            time: {
                value: 0
            },
            all: {
                value: this.num
            }
        }

        this.uni = THREE.UniformsUtils.merge( [ THREE.ShaderLib.standard.uniforms, cUni ] );
        this.uni.roughness.value = 0.8;

        let mat = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: this.uni,
            flatShading: true,
            lights: true,
            side: THREE.DoubleSide
        })

        let fluff = new THREE.Mesh( geo, mat )
        fluff.position.y = 0.00;

        this.add( fluff );
	}

	public update( time: number ){

	}


}