// minimal placeholder vertex shader (raw import with ?raw)
attribute vec3 position;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}


