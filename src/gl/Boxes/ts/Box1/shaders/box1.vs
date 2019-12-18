attribute vec3 offsetPos;
uniform mat4 rotation;
uniform float time;
varying vec3 vViewPosition;
varying vec3 vColor;

mat2 rotate(float rad) {
  return mat2(cos(rad), sin(rad), -sin(rad), cos(rad));
}

void main() {

	vec3 pos = position;

	pos.xz *= rotate( sin( time * 2.0 ) * 3.0 );
	pos.yz *= rotate( sin( time * 2.0 ) * 3.0 );
	
	pos = vec4( rotation * vec4( pos + offsetPos, 1.0 ) ).xyz;

	vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
	vViewPosition = -mvPosition.xyz;

	vColor = vec3( 1.0 );

}