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
varying vec3 vColor;

$rotate
$constants
$atan2

void main() {

	vec2 computeUV = computeCoord / computeResolution;

	vec3 wp = texture2D( positionTex, computeUV ).xyz;
	vec4 info = texture2D( infoTex, computeUV );

	vec3 vp = position;

	float rotZ = ( 0.5 - ( offsetPos.y )) * PI;
	float rotY = atan2( offsetPos.x, offsetPos.z );

	float rotW = max( 0.0, 1.0 - info.y * 0.5 );
	vp.xy *= rotate( rotZ * rotW );
	vp.xz *= rotate( ( rotY - HPI - 0.1 ) * rotW );

	vp.yz *= rotate( breath * (breath + 0.3) * sin( time * 20.0 - vp.y * 20.0) * 0.3 );


	vec4 mvPosition = modelViewMatrix * vec4(wp + vp, 1.0);
	
	gl_Position = projectionMatrix * mvPosition;
	
	vViewPosition = -mvPosition.xyz;

	vColor = vec3( 2.0 );

}