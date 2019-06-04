attribute vec3 offsetPos;
attribute float num;
varying vec3 vViewPosition;
varying vec3 vColor;
uniform float time;
uniform float all;
uniform mat4 rotation;
uniform vec2 rotVec;

$rotate
$constants
$random

void main() {
	vec3 c = vec3(1.0);
	vec3 vp = position;
	vec3 wp = offsetPos;

	float len = length(vp.y + 0.5);

	vp.xz *= max(0.0,1.0 - len * 1.0) * 0.8;
	vp.y += 1.0;

	float r = 0.1;
	vp.z += sin(-time + len * 3.0) * r * len;
	vp.x += cos(-time + len * 3.0) * r * len;
	// c.z *= sin(length(vp.y) * 3.0 - time * 5.0);
	// c.y *= abs(sin(length(vp.y) * 3.0 - time * 5.0 + 0.4));

	vp.yz *= rotate(random(vec2(0.0,num)) * TPI);
	vp.xz *= rotate(random(vec2(num,0.0)) * TPI);

	vp = vec4(rotation * vec4(vp,1.0)).xyz;
	vp.yz *= rotate(rotVec.y * length(vp) * 5.0);
	vp.xz *= rotate(-rotVec.x * length(vp) * 5.0);

	mat4 mv = modelViewMatrix;
	
	vec4 mvPosition = mv * vec4(wp + vp, 1.0);
	gl_Position = projectionMatrix * mvPosition;
	vViewPosition = -mvPosition.xyz;

	vColor = c;
}