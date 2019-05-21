import vert from './shaders/flower.vs';
import frag from './shaders/flower.fs';

import * as THREE from 'three';
import * as ORE from 'ore-three-ts';

export default class Flower extends THREE.Object3D{
    private uni: any;
    private size: THREE.Vector2;
    private num:number;

    constructor() {
        super();
        this.num = 36;
        this.size = new THREE.Vector2(1,1);

        this.createFlower();
    }

    createFlower() {
        let originBox = new THREE.PlaneBufferGeometry(this.size.x,this.size.y,10,5);
        let geo = new THREE.InstancedBufferGeometry();

        let vertice = (originBox.attributes.position as THREE.BufferAttribute).clone();
        geo.addAttribute('position', vertice);

        let normal = (originBox.attributes.normal as THREE.BufferAttribute).clone();
        geo.addAttribute('normals', normal);

        let uv = (originBox.attributes.normal as THREE.BufferAttribute).clone();
        geo.addAttribute('uv', uv);

        let indices = originBox.index.clone();
        geo.setIndex(indices);

        let offsetPos = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3, false, );
        let num = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 1), 1, false, 1);

        for (let i = 0; i < this.num; i++) {
            let x = 0;
            let y = 0;
            let z = 0;
            offsetPos.setXYZ(i, x, y, z);
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
        let flower = new THREE.Mesh(geo, mat)
        flower.position.y = -0.3
        this.add(flower);

        // let edageo = new THREE.CylinderBufferGeometry(0.02,0.02,1.2,3,1);
        // let edaMat = new THREE.MeshNormalMaterial();
        // let eda = new THREE.Mesh(edageo,edaMat);
        // eda.position.y = -0.6;
        // this.add(eda);
    }

    update(time) {
        this.uni.time.value = time;
    }
}