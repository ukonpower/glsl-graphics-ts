attribute vec3 offsetPos;

attribute float num;
uniform float all;

uniform float time;
uniform mat4 rotation;
uniform vec2 rotVec;
uniform vec3 col;


varying vec3 vViewPosition;
varying vec3 vColor;

$constants
$noise3D
$rotate
$random

void main() {
	vec3 c = col;
	vec3 vp = position;
	vec3 wp = offsetPos;
	float n = num / all * TPI;

	float d = n / 2.0 * TPI;

	vp *= 0.8;

	vp.xy *= rotate(sin(n * 5.0+ time));

	//vertex rotator
	vec4 p = vec4((rotation) * vec4(wp + vp,1.0));

	// c += length(rotVec) * 10.0;

	mat4 mv = modelViewMatrix;
	
	vec4 mvPosition = mv * p;
	gl_Position = projectionMatrix * mvPosition;
	vViewPosition = -mvPosition.xyz;

	vColor = c;
} 