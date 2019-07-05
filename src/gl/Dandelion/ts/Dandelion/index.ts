import * as THREE from 'three';
import * as ORE from 'ore-three-ts';

import fluffVert from './shaders/dandelion.vs';
import fluffFrag from './shaders/dandelion.fs';

import kukiVert from './shaders/kuki.vs';
import leafVert from './shaders/leaf.vs';

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

	private time: number = 0;

	private breath: number = 0.0;

	//gpgpu
	private gcController: ORE.GPUComputationController;
	private kernels: Kernels;
	private datas: Datas;
	private initPositionTex: THREE.DataTexture;
	private computeResolution: THREE.Vector2;

	//fluff mesh
	private fluffUni: ORE.Uniforms;
	private num: number;

	//kuki mesh
	private kukiUni: ORE.Uniforms;
	private leafUni: ORE.Uniforms;

	constructor( renderer: THREE.WebGLRenderer ){
		
		super();

		this.renderer = renderer;

		this.createFluff();
		this.createKuki();
		this.createLeaf();

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
		this.kernels.info.uniforms.time = { value: 0 };
		this.kernels.info.uniforms.deltaTime = { value: 0 };
		this.kernels.info.uniforms.breath = { value: 0 };
		this.kernels.info.uniforms.infoTex = { value: this.datas.info.buffer.texture };
		this.kernels.info.uniforms.positionTex = { value: this.datas.position.buffer.texture };
		this.kernels.info.uniforms.velocityTex = { value: this.datas.velocity.buffer.texture };

		this.kernels.position.uniforms.time = { value: 0 };
		this.kernels.position.uniforms.fluffPos = { value: 2.5 };
		this.kernels.position.uniforms.breath = { value: 0.0 };
		this.kernels.position.uniforms.initPositionTex = { value: this.initPositionTex };
		this.kernels.position.uniforms.infoTex = { value: this.datas.info.buffer.texture };
		this.kernels.position.uniforms.positionTex = { value: this.datas.position.buffer.texture };
		this.kernels.position.uniforms.velocityTex = { value: this.datas.velocity.buffer.texture };

		this.kernels.velocity.uniforms.time = { value: 0 };
		this.kernels.velocity.uniforms.infoTex = { value: this.datas.info.buffer.texture };
		this.kernels.velocity.uniforms.positionTex = { value: this.datas.position.buffer.texture };
		this.kernels.velocity.uniforms.velocityTex = { value: this.datas.velocity.buffer.texture };

		let geo = new THREE.InstancedBufferGeometry();
		
		//copy original mesh
		let fluffMesh = new THREE.BoxBufferGeometry( 0.01, 0.2, 0.01, 1, 20 );

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
        let offsetPos = new THREE.InstancedBufferAttribute( spherePos , 3, false, 1 );

        for (let i = 0; i < this.num; i++) {
			n.setX(i, i);
			computeCoord.setXY(i, i % this.computeResolution.x, Math.floor( i / this.computeResolution.x ))
        }

        geo.addAttribute('num', n);
        geo.addAttribute('computeCoord', computeCoord);
        geo.addAttribute('offsetPos', offsetPos);

        let cUni = {
            time: {
                value: 0
            },
            all: {
                value: this.num
			},
			breath: {
				value: 0
			},
			computeResolution: {
				value: this.computeResolution
			},
			positionTex: {
				value: null
			},
			infoTex:{ 
				value: null
			}
        }

        this.fluffUni = THREE.UniformsUtils.merge( [ THREE.ShaderLib.standard.uniforms, cUni ] );
        this.fluffUni.roughness.value = 0.8;

        let mat = new THREE.ShaderMaterial({
            vertexShader: fluffVert,
            fragmentShader: fluffFrag,
            uniforms: this.fluffUni,
            flatShading: true,
            lights: true,
            side: THREE.DoubleSide
        })

        let fluff = new THREE.Mesh( geo, mat );
		this.add( fluff );

	}

	private createKuki(){

		let cUni = {
			time: { value: 0.0 },
			breath:{ value: 0.0 },
		}

		let baseMat = THREE.ShaderLib.standard;

		this.kukiUni = THREE.UniformsUtils.merge( [ baseMat.uniforms, cUni ] );

		let kukiGeo = new THREE.CylinderGeometry( 0.03, 0.03, 2.5, 5, 30 );

		let kukiMat = new THREE.ShaderMaterial({
			vertexShader: kukiVert,
			fragmentShader: baseMat.fragmentShader,
			uniforms: this.kukiUni,
			lights: true
		});

		this.kukiUni.diffuse.value = new THREE.Color( 0xbaba6e );
		
		let kuki = new THREE.Mesh( kukiGeo, kukiMat );
		
		this.add( kuki );
		
	}

	private createLeaf(){

		let cUni = {
			time: { value: 0.0 },
			breath:{ value: 0.0 },
		}

		let baseMat = THREE.ShaderLib.standard;

		this.leafUni = THREE.UniformsUtils.merge( [ baseMat.uniforms, cUni ] );

		let geo = new THREE.PlaneGeometry( 2, 1, 24, 2 );
		let mat = new THREE.ShaderMaterial({
			vertexShader: leafVert,
			fragmentShader: baseMat.fragmentShader,
			uniforms: this.leafUni,
			lights: true,
			flatShading: true,
			side: THREE.DoubleSide
		});

		this.leafUni.diffuse.value = new THREE.Color( 0x8FBD2D );

		let leaf = new THREE.Mesh( geo, mat );

		this.add( leaf );

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

	public update( deltaTime: number ){

		this.time += deltaTime;
		this.breath *= 0.96;

		this.kernels.info.uniforms.time.value = this.time;
		this.kernels.info.uniforms.deltaTime.value = deltaTime;
		this.kernels.info.uniforms.breath.value = this.breath;
		this.kernels.info.uniforms.velocityTex.value = this.datas.velocity.buffer.texture;
		this.kernels.info.uniforms.positionTex.value = this.datas.position.buffer.texture;
		this.kernels.info.uniforms.infoTex.value = this.datas.info.buffer.texture;
		this.gcController.compute( this.kernels.info, this.datas.info );

		this.kernels.velocity.uniforms.time.value = this.time;
		this.kernels.velocity.uniforms.velocityTex.value = this.datas.velocity.buffer.texture;
		this.kernels.velocity.uniforms.positionTex.value = this.datas.position.buffer.texture;
		this.kernels.velocity.uniforms.infoTex.value = this.datas.info.buffer.texture;
		this.gcController.compute( this.kernels.velocity, this.datas.velocity );

		this.kernels.position.uniforms.time.value = this.time;
		this.kernels.position.uniforms.breath.value = this.breath;
		this.kernels.position.uniforms.velocityTex.value = this.datas.velocity.buffer.texture;
		this.kernels.position.uniforms.positionTex.value = this.datas.position.buffer.texture;
		this.kernels.position.uniforms.infoTex.value = this.datas.info.buffer.texture;
		this.gcController.compute( this.kernels.position, this.datas.position );

		this.fluffUni.positionTex.value = this.datas.position.buffer.texture;

		this.fluffUni.time.value = this.time;
		this.fluffUni.breath.value = this.breath;
		this.fluffUni.infoTex.value = this.datas.info.buffer.texture;

		this.kukiUni.time.value = this.time;
		this.kukiUni.breath.value = this.breath;

		this.leafUni.time.value = this.time;

	}

	public addBreath( breath: number ){

		this.breath += breath;

	}


}