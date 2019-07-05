uniform float time;
uniform float breath;

varying vec3 vViewPosition;
varying vec3 vNormal;

$rotate
$constants

void main() {

	vec3 pos = position;

	pos.yz *= rotate( HPI );

	pos.z *= sin( length( pos.x ) * PI ) + (sin( length( pos.x ) * PI * 4.0)) * 0.5;
	pos.y += sin( length( pos.x ) * 2.0 ) * ( 1.0 - length( pos.z ));
	pos.x *= 2.;

	vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
	
	gl_Position = projectionMatrix * mvPosition;
	
	vViewPosition = -mvPosition.xyz;
	vNormal = normal;

}