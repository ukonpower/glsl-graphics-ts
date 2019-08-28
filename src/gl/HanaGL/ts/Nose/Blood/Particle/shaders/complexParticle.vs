
attribute vec2 computeCoord;

uniform float windowSizeY;
uniform sampler2D texturePosition;

uniform float num;

varying vec4 vColor;

void main(void){

	vec4 data = texture2D( texturePosition, computeCoord / num );
	vec3 pos = vec3( data.xyz );

	vec3 c = vec3(0.0);
	vColor = vec4( data.w / 50.0, 0.7, 0.7, (1.0 - length( pos ) * ( 0.5 )) * 0.5 );
	
	gl_PointSize = (windowSizeY / 50.0) * smoothstep( 0.0, 1.0,  1.0 - length( pos ) / 2.0 ) * 0.5;

	pos *= 0.6;

	vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
	gl_Position = projectionMatrix * mvPosition;
}