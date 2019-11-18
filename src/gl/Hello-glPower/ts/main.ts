import * as GLP from '../../../glpower/src';

import vert from './shaders/cube.vs';
import frag from './shaders/cube.fs';
import { glPower } from './glPower';
import { Background } from './Background';

export class APP{

	private renderer: GLP.Renderer;
	private gl: WebGLRenderingContext;
	
	private scene: GLP.Scene;
	private camera: GLP.Camera;

	private time: number = 0;

	private glpower: glPower;
	private background: Background;

	constructor(){

		this.renderer = new GLP.Renderer({
			canvas: document.querySelector( '#canvas' ),
			retina: true
		});

		this.gl = this.renderer.gl;

		this.renderer.setSize( window.innerWidth, window.innerHeight );

		this.initScene();

		this.animate();

		window.addEventListener( 'resize', this.resize.bind( this ) );

	}

	private initScene(){
		
		this.scene = new GLP.Scene();

		this.camera = new GLP.Camera( 50, 0.1, 1000, window.innerWidth / window.innerHeight );
		this.camera.position.set( 0, 0, 5 );

		this.glpower = new glPower();
		this.scene.add( this.glpower );

		this.background = new Background();
		this.scene.add( this.background );
		

	}

	private animate(){

		this.time += 1.0;

		this.glpower.update( this.time );

		this.background.update( this.time );
		
		this.renderer.render( this.scene, this.camera );

		requestAnimationFrame( this.animate.bind( this ) );

	}

	private resize(){

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.renderer.setSize( window.innerWidth, window.innerHeight );

	}

}

window.addEventListener( 'DOMContentLoaded', () => {

	new APP();

});