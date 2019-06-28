attribute vec3 offsetPos;
attribute float num;
attribute vec2 computeCoord;

uniform float time;
uniform float all;
uniform vec2 computeResolution;

uniform sampler2D positionTex;

varying vec3 vViewPosition;
varying vec3 vColor;

$rotate
$constants

void main() {

	vec2 computeUV = computeCoord / computeResolution;

	vec3 wp = texture2D( positionTex, computeUV ).xyz;
	vec3 vp = position;


	vec4 mvPosition = modelViewMatrix * vec4(wp + vp, 1.0);
	
	gl_Position = projectionMatrix * mvPosition;
	
	vViewPosition = -mvPosition.xyz;

	vColor = vec3( 1.0 );

}