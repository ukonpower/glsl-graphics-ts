import * as THREE from 'three';
import * as ORE from 'ore-three-ts';

import vert from './shaders/floor.vs';
import frag from './shaders/floor.fs';

export default class Floor extends THREE.Object3D{

    private shapes: number;
    private loop: number;
    private space: number;
    private uni: ORE.Uniforms;

    constructor(){

        super();

        // let geo = new THREE.PlaneGeometry( 100.0, 100.0, 10, 10 );        

        // let cUni = {
        //     time: { value: 0 }
        // }

        // this.uni = THREE.UniformsUtils.merge( [ THREE.ShaderLib.standard.uniforms, cUni ] );
        
        // let mat = new THREE.ShaderMaterial({
        //     vertexShader: vert,
        //     fragmentShader: frag,
        //     uniforms: this.uni,
        //     lights: true,
        //     flatShading: true,
        //     fog: true
        // });
        
        // this.uni.roughness.value = 0.8;

        // this.add( new THREE.Mesh( geo, mat ) );

        let geo = new THREE.CylinderGeometry( 1, 1, 0.2, 30);
        let mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color( 0x332222 )
        });
        let mesh = new THREE.Mesh( geo, mat );

        this.add( mesh );

    }

    update( time: number ){

        // this.uni.time.value = time;
    
    }
}