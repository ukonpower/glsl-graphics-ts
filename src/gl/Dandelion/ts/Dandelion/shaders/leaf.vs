uniform float time;
uniform float breath;

varying vec3 vViewPosition;
varying vec3 vNormal;

$rotate
$constants

void main() {

	vec3 pos = position;

	pos.yz *= rotate( HPI );

	float lenX = length( pos.x );
	pos.z *= (sin( lenX * PI )) * 0.7 * ( 1.5 - abs( sin( lenX * PI * 3.0 )) * 0.8);
	pos.y += sin( lenX * HPI ) + sin( lenX * 2.0 - time ) * 0.2 * lenX -  ( sin(length( pos.z ) * 0.3));
	
	pos.x *= 1.5;

	vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
	
	gl_Position = projectionMatrix * mvPosition;
	
	vViewPosition = -mvPosition.xyz;
	vNormal = normal;

}