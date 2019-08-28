uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform vec2 resolution;

uniform float deltaTime;

uniform vec3 eruptionPos;

$random

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 posData = texture2D( texturePosition, uv );
    vec3 pos = posData.xyz;
    float time = posData.w;
    
    vec4 velData = texture2D( textureVelocity, vec2(0.0, uv.y) );
    vec3 vel = velData.xyz;
    float lifeTime = velData.w;

    if(gl_FragCoord.x <= 1.0){

        if( time < lifeTime ){

            time += deltaTime;
            
            pos += vel * 0.01;

        }else{

            vec3 rndOffset = vec3(
                random( vec2( time ) ),
                random( vec2( time + vec2(4.,655.) ) ),
                random( vec2( time + vec2( 44.39,49. ) ) )
		    ) - 0.5;

            pos = eruptionPos + rndOffset * 0.2;
            time = 0.0;

        }
        
    }else{

        if( time < lifeTime ){
            
            vec2 bUV = (gl_FragCoord.xy - vec2(1.0,0.0)) / resolution.xy;
            pos = texture2D( texturePosition, bUV ).xyz;
            
            time += deltaTime;

        }else{

            time = 0.0;
            pos = eruptionPos;

        }


    }

    
    gl_FragColor = vec4(pos,time);
    
}