import * as THREE from 'three';
import * as ORE from 'ore-three-ts';

import vert from './shaders/dandelion.vs';
import frag from './shaders/dandelion.fs';

import comshaderInfo from './shaders/comShaders/info.fs';
import comShaderPosition from './shaders/comShaders/position.fs';
import comShaderVelocity from './shaders/comShaders/velocity.fs';

declare interface Kernels{
	info: ORE.GPUComputationKernel
	position: ORE.GPUComputationKernel;
	velocity: ORE.GPUComputationKernel;
}

declare interface Datas{
	position: ORE.GPUcomputationData;
	velocity: ORE.GPUcomputationData;
	info: ORE.GPUcomputationData;
}

export class Dandelion extends THREE.Object3D{

	private renderer: THREE.WebGLRenderer;

	//gpgpu
	private gcController: ORE.GPUComputationController;
	private kernels: Kernels;
	private datas: Datas;
	private initPositionTex: THREE.DataTexture;
	private computeResolution: THREE.Vector2;

	//mesh
	private uni: ORE.Uniforms;
	private num: number;

	constructor( renderer: THREE.WebGLRenderer ){
		
		super();

		this.renderer = renderer;

		this.createFluff();

	}

	private createFluff(){

		this.computeResolution = new THREE.Vector2( 41, 31 );
		this.gcController = new ORE.GPUComputationController( this.renderer, this.computeResolution );
		
		//position
		let sphere = new THREE.SphereBufferGeometry( 0.5, 40, 30 );
		let spherePos = sphere.attributes.position.array;
		
		this.initPositionTex = this.getInitPosition( spherePos );
		this.num = spherePos.length;

		//いい感じの解像度求めるくん
		// for( let i = 0; i < 1000; i++ ){
		// 	if( this.num / 3 / i - Math.floor( this.num / 3 / i) == 0 ){
		// 		console.log(i);
		// 	}
		// }

		//kernels & datas
		this.kernels = {
			info: this.gcController.createKernel( comshaderInfo ),
			position: this.gcController.createKernel( comShaderPosition ),
			velocity: this.gcController.createKernel( comShaderVelocity ),
		}

		this.datas = {
			info: this.gcController.createData(),
			position: this.gcController.createData( this.initPositionTex ),
			velocity: this.gcController.createData()
		}

		//set compute uniforms
		this.kernels.info.uniforms.infoTex = { value: this.datas.info.buffer.texture };
		this.kernels.info.uniforms.positionTex = { value: this.datas.position.buffer.texture };
		this.kernels.info.uniforms.velocityTex = { value: this.datas.velocity.buffer.texture };

		this.kernels.position.uniforms.initPositionTex = { value: this.initPositionTex };
		this.kernels.position.uniforms.infoTex = { value: this.datas.info.buffer.texture };
		this.kernels.position.uniforms.positionTex = { value: this.datas.position.buffer.texture };
		this.kernels.position.uniforms.velocityTex = { value: this.datas.velocity.buffer.texture };

		this.kernels.velocity.uniforms.infoTex = { value: this.datas.info.buffer.texture };
		this.kernels.velocity.uniforms.positionTex = { value: this.datas.position.buffer.texture };
		this.kernels.velocity.uniforms.velocityTex = { value: this.datas.velocity.buffer.texture };

		let geo = new THREE.InstancedBufferGeometry();
		
		//copy original mesh
		let fluffMesh = new THREE.BoxBufferGeometry( 0.05, 0.05, 0.05 );

        let vertice = ( fluffMesh.attributes.position as THREE.BufferAttribute).clone();
        geo.addAttribute( 'position', vertice );

        let normal = ( fluffMesh.attributes.normal as THREE.BufferAttribute ).clone();
        geo.addAttribute( 'normals', normal );

        let uv = ( fluffMesh.attributes.normal as THREE.BufferAttribute ).clone();
        geo.addAttribute( 'uv', uv );

        let indices = fluffMesh.index.clone();
		geo.setIndex( indices );

		
        let n = new THREE.InstancedBufferAttribute( new Float32Array(this.num * 1), 1, false, 1 );
        let computeCoord = new THREE.InstancedBufferAttribute( new Float32Array(this.num * 2), 2, false, 1 );

        for (let i = 0; i < this.num; i++) {
			n.setX(i, i);
			computeCoord.setXY(i, i % this.computeResolution.x, Math.floor( i / this.computeResolution.x ))
        }

        geo.addAttribute('num', n);
        geo.addAttribute('computeCoord', computeCoord);

        let cUni = {
            time: {
                value: 0
            },
            all: {
                value: this.num
			},
			computeResolution: {
				value: this.computeResolution
			},
			positionTex: {
				value: null
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

        let fluff = new THREE.Mesh( geo, mat );

        this.add( fluff );
	}

	private getInitPosition( array: any ): THREE.DataTexture{

		let tex = this.gcController.createInitializeTexture();
		
		for( let i = 0; i < tex.image.data.length; i +=4 ){

			let diff = Math.floor( i / 4 );

			tex.image.data[i] = array[i - diff];
			tex.image.data[i + 1] = array[i + 1 - diff];
			tex.image.data[i + 2] = array[i + 2 - diff];
			tex.image.data[i + 3] = 0;

		}
		
		return tex;
	}

	public update( time: number ){

		this.kernels.info.uniforms.velocityTex.value = this.datas.velocity.buffer.texture;
		this.kernels.info.uniforms.positionTex.value = this.datas.position.buffer.texture;
		this.kernels.info.uniforms.infoTex.value = this.datas.info.buffer.texture;
		this.gcController.compute( this.kernels.info, this.datas.info );

		this.kernels.velocity.uniforms.velocityTex.value = this.datas.velocity.buffer.texture;
		this.kernels.velocity.uniforms.positionTex.value = this.datas.position.buffer.texture;
		this.kernels.velocity.uniforms.infoTex.value = this.datas.info.buffer.texture;
		this.gcController.compute( this.kernels.velocity, this.datas.velocity );

		this.kernels.position.uniforms.velocityTex.value = this.datas.velocity.buffer.texture;
		this.kernels.position.uniforms.positionTex.value = this.datas.position.buffer.texture;
		this.kernels.position.uniforms.infoTex.value = this.datas.info.buffer.texture;
		this.gcController.compute( this.kernels.position, this.datas.position );

		this.uni.positionTex.value = this.datas.position.buffer.texture;

	}


}