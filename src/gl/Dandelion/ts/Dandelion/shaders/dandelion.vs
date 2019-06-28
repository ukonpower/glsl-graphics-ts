attribute vec3 offsetPos;
attribute float num;

uniform float time;
uniform float all;

varying vec3 vViewPosition;
varying vec3 vColor;

$rotate
$constants

void main() {

	vec3 wp = offsetPos;
	vec3 vp = position;


	
	
	vec4 mvPosition = modelViewMatrix * vec4(wp + vp, 1.0);
	
	gl_Position = projectionMatrix * mvPosition;
	
	vViewPosition = -mvPosition.xyz;

	vColor = vec3( 1.0 );

}