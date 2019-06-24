import vert from './shaders/uni.vs';
import frag from './shaders/uni.fs';

import * as THREE from 'three';
import * as ORE from 'ore-three-ts';
import { Vector2 } from 'three';
import { MouseVertexRotator } from '../MouseVertexRotator';

export default class Flower extends THREE.Object3D{
    private uni: any;
    private size: THREE.Vector2;
    private num:number;
    public mouseVertRotator: MouseVertexRotator;

    constructor() {
        super();
        this.size = new THREE.Vector2(1,1);
        this.createFlower();
    }

    createFlower() {
        let originBox = new THREE.CylinderBufferGeometry(0.0,0.25,0.5);
        let geo = new THREE.InstancedBufferGeometry();

        let vertice = (originBox.attributes.position as THREE.BufferAttribute).clone();
        geo.addAttribute('position', vertice);

        let normal = (originBox.attributes.normal as THREE.BufferAttribute).clone();
        geo.addAttribute('normals', normal);

        let uv = (originBox.attributes.normal as THREE.BufferAttribute).clone();
        geo.addAttribute('uv', uv);

        let indices = originBox.index.clone();
        geo.setIndex(indices);

        const sphereGeo = new THREE.SphereBufferGeometry(2,30,40);
        const array = sphereGeo.attributes.position.array;

        this.num = array.length;

        let offsetPos = new THREE.InstancedBufferAttribute(array, 3, false, );

        let num = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, false, 1);

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
            },
            col: {
                value: null
            }
        }

        this.uni = THREE.UniformsUtils.merge([THREE.ShaderLib.standard.uniforms, cUni]);
        this.uni.roughness.value = 0.8;

        let mat = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: this.uni,
            flatShading: true,
            lights: true,
            side: THREE.DoubleSide
        })

        let some = new THREE.Mesh(geo, mat)
        some.position.y = 0.00;

        this.mouseVertRotator = new MouseVertexRotator(some,this.uni);
        this.changeColor();
        this.add(some);
    }

    update(time: number) {
        this.uni.time.value = time;
        this.mouseVertRotator.update();
    }

    public changeColor(){
        let col = new THREE.Vector3();
        col.x = Math.random() * 1.2;
        col.y = Math.random() * 1.2;
        col.z = Math.random() * 1.2;
        this.uni.col.value = col;
    }
}