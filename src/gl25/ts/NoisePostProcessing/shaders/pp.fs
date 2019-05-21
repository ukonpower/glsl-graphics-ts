uniform sampler2D backbuffer;
varying vec2 vUv;

uniform float time;

#define N 16


@import ../../../../glsl-chunks/random;

void main(void){
	vec3 c;
    vec2 u = vUv * 2.0 - 1.0;

    // float w = max(.0,length(u)) * 0.03;
    // vec2 vig = u * w;
    // for(int i = 0; i < N; i++){
    //     vig *= 1.0 + float(i) * 0.01;
    //     c.x += texture2D(backbuffer,vUv - vig).x;
    //     c.y += texture2D(backbuffer,vUv - vig * 0.5).y;
    //     c.z += texture2D(backbuffer,vUv - vig * 1.0).z;
    // }
    // c /= float(N) - 5.0;
	
    c = texture2D(backbuffer,vUv).xyz;
	c += random(vUv + time) * 0.15;
	gl_FragColor = vec4(c,1.0);
}