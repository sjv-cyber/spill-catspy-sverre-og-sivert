shader_type canvas_item;
/// Drop pixels near magenta (#FF00FF) — same idea as Phaser `chromaTexture.js`.

uniform vec3 chroma_rgb : source_color = vec3(1.0, 0.0, 1.0);
uniform float threshold : hint_range(0.0, 1.0) = 0.22;

void fragment() {
	vec4 tex = texture(TEXTURE, UV);
	vec3 d = abs(tex.rgb - chroma_rgb);
	if (d.r + d.g + d.b < threshold) {
		discard;
	}
	COLOR = tex;
}
