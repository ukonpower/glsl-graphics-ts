import * as THREE from 'three';
import { BloodParticle } from './Particle';

export class Blood extends THREE.Object3D{

	private renderer: THREE.WebGLRenderer;

	private particle: BloodParticle;

	constructor( renderer: THREE.WebGLRenderer ){

		super();

		this.renderer = renderer;

		this.createParticle();

	}

	private createParticle(){

		this.particle = new BloodParticle( this.renderer, 128 );
		this.add( this.particle );

	}

	public update( deltaTime: number ){

		this.particle.update( deltaTime );

	}
}