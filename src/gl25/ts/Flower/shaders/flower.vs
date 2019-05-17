attribute vec3 offsetPos;
attribute float num;
varying vec3 vViewPosition;
varying vec3 vColor;
uniform float time;
uniform float all;

@import ../../../../glsl-chunks/rotate;
@import ../../../../glsl-chunks/constants;

void main() {
	vec3 vp = position;
	vec3 wp = offsetPos;
	vp.y *= sin((vp.x + 0.5) * PI) * 0.4;

	float n = num / all;
	float r = TPI * n;
	float blk = 6.0;
	float stp = floor(n * blk) / blk;
	vp += vec3(0.5,0.0,0.0);
	vp *= 1.0 - stp + 0.2;
	vp.yz *= rotate(HPI);
	vp.xy *= rotate(-(cos((-length(vp.x) - length(vp.z)) * 3.0 + time) + 1.0) / 2.0 * 0.5 - stp);
	vp.xz *= rotate(r * blk + stp * PI);

	vec4 mvPosition = modelViewMatrix * vec4(wp + vp, 1.0);
	gl_Position = projectionMatrix * mvPosition;
	vViewPosition = -mvPosition.xyz;
	vec3 c = vec3(1.0);
	c.x -= stp * 2.0;
	c.y -= 1.0 - stp * 1.0;
	c.z -= 1.0 - stp * 2.0;
	vColor = c;
}