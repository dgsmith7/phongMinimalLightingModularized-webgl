// function initializeWebGL(canvasId) {
//   const canvas = document.getElementById(canvasId);
//   const gl = canvas.getContext("webgl2");
//   if (!gl) {
//     alert("WebGL 2.0 not available");
//     return null;
//   }
//   gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
//   gl.clearColor(0.1, 0.1, 0.1, 1.0);
//   gl.enable(gl.DEPTH_TEST);
//   return gl;
// }
function initializeWebGL(canvasId) {
  const canvas = document.getElementById(canvasId);
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("WebGL 2.0 not available");
    return null;
  }

  // Resize helper: make the canvas backing store match CSS size * DPR
  function resizeCanvasToDisplaySize() {
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const displayHeight = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      return true;
    }
    return false;
  }

  // Configure viewport to match the canvas drawing buffer size
  function configureViewport() {
    resizeCanvasToDisplaySize();
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }

  // Initial configuration
  configureViewport();
  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Expose helpers on the returned gl object (parity with WebGPU helper)
  gl.resizeCanvasToDisplaySize = resizeCanvasToDisplaySize;
  gl.configureViewport = configureViewport;
  gl.onResize = function () {
    const changed = resizeCanvasToDisplaySize();
    if (changed) {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
  };

  return gl;
}

function initializeShaders(gl, vertexShaderSource, fragmentShaderSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource); // see shaderUtils.js
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  return createProgram(gl, vertexShader, fragmentShader);
}
