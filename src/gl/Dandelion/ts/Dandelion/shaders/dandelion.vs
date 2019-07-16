attribute vec3 offsetPos;
attribute float num;
attribute vec2 computeCoord;

uniform float time;
uniform float all;
uniform vec2 computeResolution;
uniform float breath;

uniform sampler2D infoTex;
uniform sampler2D positionTex;

varying vec3 vViewPosition;
varying vec4 vColor;

$rotate
$constants
$atan2

void main() {

	vec2 computeUV = computeCoord;

	vec3 wp = texture2D( positionTex, computeUV ).xyz;
	vec4 info = texture2D( infoTex, computeUV );

	vec3 vp = position;

	vp.y -= 0.15;

	float rotZ = offsetPos.z;
	float rotY = offsetPos.y;
	
	float rotW = max( 0.0, 1.0 - info.y * 0.5 );
	
	vp.xy *= rotate( rotZ );
	vp.xz *= rotate( rotY - HPI);
 
	vp.yz *= rotate( breath * 1.0 );

	vec4 mvPosition = modelViewMatrix * vec4(wp + vp, 1.0);
	
	gl_Position = projectionMatrix * mvPosition;
	
	vViewPosition = -mvPosition.xyz;

	vec3 c = vec3( 1.0 );

	vColor = vec4( c , info.w );

}