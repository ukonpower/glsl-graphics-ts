attribute vec3 offsetPos;
attribute float num;
varying vec3 vViewPosition;
varying vec3 vColor;
uniform float time;
uniform float all;
uniform vec3 col;
uniform mat4 rotation;
uniform vec2 rotVec;

$rotate
$constants

void main() {
	vec3 c = vec3(0.0);
	vec3 vp = position;
	vec3 wp = offsetPos;
	vp.y *= sin((vp.x + 0.5) * PI) * 0.4;

	float n = num / all;
	float r = TPI * n;
	float blk = 10.0;
	float stp = floor(n * blk) / blk;

	vp += vec3(0.5,0.0,0.0);
	vp *= 1.0 - stp + 0.2;

	c += smoothstep(0.9,1.0,length(vp.y * 5.0));

	vp.yz *= rotate(HPI);
	vp.xy *= rotate(-(cos((-length(vp.x) - length(vp.z)) * 3.0 + time) + 1.0) / 2.0 * 0.5 - stp * 30.0);
	vp.xz *= rotate(r * blk + stp * PI);

	// vp.xz *= rotate(rotation.y);
	// vp.yz *= rotate(-rotation.x);

	// vp *= mat4();

	float cw = (sin(time) + 1.0 ) / 2.0;
	
	float w = (sin(length(vp.xz * 4.0) - time + stp * 10.0) + 1.0) / 2.0;

	w = smoothstep(0.7,1.0,w);
	c += vec3(w);

	c += vec3(1.0 - length(vp.xz) * 0.7);
	
	c.x -= 2.0 * col.x;
	c.y -= 1.0 - stp * 2.0 * col.y;
	c.z -= 1.0 - stp * 2.0 * col.z;

	vColor = vec3(1.0);

	vp = vec4(rotation * vec4(vp,1.0)).xyz;

	vp.xz *= rotate(-rotVec.x * length(vp) * 10.0);
	vp.yz *= rotate(rotVec.y * length(vp) * 10.0);

	mat4 mv = modelViewMatrix;
	
	vec4 mvPosition = mv * vec4(wp + vp, 1.0);
	gl_Position = projectionMatrix * mvPosition;
	vViewPosition = -mvPosition.xyz;
}