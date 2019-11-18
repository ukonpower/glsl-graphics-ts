precision highp float;

attribute vec3 position;
attribute vec3 offsetPos;
attribute vec3 color;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 offsetUV;
attribute float n;

uniform float time;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D tex;

varying vec3 vColor;

attribute float ind;

mat2 rotate(float rad) {
  return mat2(cos(rad), sin(rad), -sin(rad), cos(rad));
}

float random(vec2 p){
    return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ){

	vec3 pos = position;

	// pos *= sin( ind * 0.1 + time * 0.5 ) * 0.05 + 1.0;

	float n = random( vec2( ind, time ) ) * 1.0 + 1.0;

	// n *= sin( pos.x + time * 0.2 );

	float res = smoothstep( -1.0, 1.0, sin( time * 0.1 - 3.14 / 4.0) ) * 50.0 + 10.0;	

	pos = floor( pos * res ) / res;

	pos.z *= n;

	pos.yz *= rotate( smoothstep( -1.0, 1.0, (sin( time * 0.05 ))) * 3.14 * 6.0 );
	pos.xy *= rotate( -sin( time * 0.05 ) * 3.14 * 2.1 );

	pos.z += sin( time * 0.1 - 3.14 / 3.0 ) * 2.;

	pos.y += sin( time * 0.05 ) * 0.2;
	pos.x += cos( time * 0.09 ) * 0.2;

	vec4 mvPosition = modelViewMatrix * vec4( pos + offsetPos, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
	gl_PointSize = 5.0;

	vColor = vec3( normal );

}