import * as GLP from '../../../../glpower/src';

import vert from './shaders/floatingObj.vs';
import frag from './shaders/floatingObj.fs';

export class FloatingObj extends GLP.Empty{

	private gl: WebGLRenderingContext;
	private uni: GLP.Uniforms;
	
	constructor( gl: WebGLRenderingContext ){

		super();

		this.gl = gl;
		
		this.initMesh();
		
	}

	private initMesh(){

		let loader = new GLP.GLTFLoader();

		this.uni = {
			time: {
				value: 0
			},

		}

		let mat = new GLP.Material({
			vert: vert,
			frag: frag,
			uniforms: this.uni
		})
		
		loader.load( './assets/glpower.gltf', ( data ) => {

			let geo = new GLP.Geometry();
			
			geo.add( 'position', data.glpower.position.array, data.glpower.position.size );
			geo.add( 'normal', data.glpower.normal.array, data.glpower.normal.size );
			geo.add( 'index', data.glpower.indices.array, data.glpower.indices.size );
			
			let offsetPos = [];
			let n = [];
			
			for( let i = 0; i < 200; i++ ){

				n.push( i );
				
				offsetPos.push(
					( Math.random() - 0.5 ) * 10.0,
					( Math.random() - 0.5 ) * 10.0,
					( Math.random() - 0.5 ) * 100.0 - 10.0,
				)
				
			}

			geo.add( 'offsetPos', offsetPos, 3, true );
			geo.add( 'num', n, 1, true );
			
			let obj = new GLP.RenderingObject({
				geo: geo,
				mat: mat,
				drawType: this.gl.LINE_LOOP
			});
	
			this.add( obj );
			
		});
		
	}

	public update( time: number ){

		this.uni.time.value = time;
		
	}


	
}