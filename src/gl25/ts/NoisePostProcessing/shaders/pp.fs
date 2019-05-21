uniform sampler2D backbuffer;
varying vec2 vUv;

uniform float time;

@import ../../../../glsl-chunks/random;

void main(void){
	vec3 c = texture2D(backbuffer,vUv).xyz;
	c += random(vUv + time) * 0.15;

	vec2 uv = vUv * 2.0 - 1.0;
	c -= length(uv) * 0.3;
	gl_FragColor = vec4(c,1.0);
}