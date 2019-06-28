uniform vec2 resolution;

uniform sampler2D infoTex;
uniform sampler2D velocityTex;
uniform sampler2D positionTex;

void main( void ){
	
	vec2 uv = gl_FragCoord.xy / resolution;

	vec4 info = texture2D( infoTex, uv );
	vec3 pos = texture2D( positionTex, uv ).xyz;
	vec3 vel = texture2D( velocityTex, uv ).xyz;
	
	gl_FragColor = vec4( 0.0 );

}