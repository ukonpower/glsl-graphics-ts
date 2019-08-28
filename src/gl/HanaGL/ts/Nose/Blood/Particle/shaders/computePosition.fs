uniform vec2 resolution;
uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform float deltaTime;

void main( void ){

	vec2 uv = gl_FragCoord.xy / (resolution - 1.0);

	vec4 posData = texture2D( texturePosition, uv );
	vec3 pos = posData.xyz;
	float time = posData.w;

	vec4 velData = texture2D( textureVelocity, uv );
	vec3 vel = velData.xyz;

	if( length( pos ) < 1.5 ){
		
		pos += vel * deltaTime;
		posData.w += 1.0 * deltaTime;

	}else{

		pos = vec3( 0.0 );
		posData.w = 0.0;

	}

	posData.w += deltaTime;

	gl_FragColor = vec4( pos, posData.w );

}