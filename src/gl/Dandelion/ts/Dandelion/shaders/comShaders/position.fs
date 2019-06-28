uniform vec2 resolution;
uniform sampler2D velocityTex;
uniform sampler2D positionTex;
uniform sampler2D initPositionTex;

void main( void ){
	
	vec2 uv = gl_FragCoord.xy / resolution;

	vec3 pos = texture2D( initPositionTex, uv ).xyz;
	vec3 vel = texture2D( velocityTex, uv ).xyz;
	
	gl_FragColor = vec4( pos, 0.0 );

}