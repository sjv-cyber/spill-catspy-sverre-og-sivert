shader_type canvas_item;
/// Key out #FF00FF with a soft matte + despill — avoids pink halos from hard discard + bilinear filtering.

uniform vec3 chroma_rgb : source_color = vec3(1.0, 0.0, 1.0);
/// L1 distance (|dr|+|dg|+|db|) below key_start → fully transparent; above key_end → opaque; smooth between.
uniform float key_start : hint_range(0.0, 1.0) = 0.10;
uniform float key_end : hint_range(0.0, 2.0) = 0.38;

void fragment() {
	vec4 tex = texture(TEXTURE, UV);
	vec3 d = abs(tex.rgb - chroma_rgb);
	float dist = d.x + d.y + d.z;
	float matte = smoothstep(key_start, key_end, dist) * tex.a;

	vec3 rgb = tex.rgb;
	// Fringes: high R and B vs G — pull toward neutral while matte is still ramping up
	float edge = 1.0 - matte;
	float near_magenta = max(0.0, min(rgb.r, rgb.b) - rgb.g);
	rgb.r = clamp(rgb.r - near_magenta * edge * 0.5, 0.0, 1.0);
	rgb.b = clamp(rgb.b - near_magenta * edge * 0.5, 0.0, 1.0);
	rgb.g = clamp(rgb.g + near_magenta * edge * 0.14, 0.0, 1.0);

	COLOR = vec4(rgb, matte);
}
