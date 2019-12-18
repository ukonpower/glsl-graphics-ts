uniform mat4 rotation;
varying vec3 vViewPosition;
varying vec3 vColor;

void main() {

	vec3 pos = position;

	pos = vec4( rotation * vec4( pos, 1.0 ) ).xyz;

	vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
	vViewPosition = -mvPosition.xyz;

	vColor = vec3( 1.0 );

}