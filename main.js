"use strict";

let gl = initializeWebGL("gl-canvas"); // see webglUtils.js
if (!gl) console.log("Your browser does not support webgl2");

const program = initializeShaders(gl, vertexShaderSource, fragmentShaderSource); // see shaders.js and webglUtils.js
gl.useProgram(program);

// generate terrain mesh and normals
const vertices = generateMesh(); // geometryUtils.js
const { p: positionsArray, n: normalsArray } = computeNormals(vertices); // geometryUtils.js

// create and bind attribute buffers once (use bufferUtils helpers)
const vertexBuffer = createBuffer(gl, flatten(positionsArray));
const normalBuffer = createBuffer(gl, flatten(normalsArray));

const aPosition = gl.getAttribLocation(program, "aPosition");
const aNormal = gl.getAttribLocation(program, "aNormal");
bindBuffer(gl, vertexBuffer, aPosition, 4);
bindBuffer(gl, normalBuffer, aNormal, 4);

// uniform locations
const uModelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
const uProjectionMatrixLoc = gl.getUniformLocation(
  program,
  "uProjectionMatrix"
);
const uNormalMatrixLoc = gl.getUniformLocation(program, "uNormalMatrix");
const uLightPositionLoc = gl.getUniformLocation(program, "uLightPosition");
const uAmbientProductLoc = gl.getUniformLocation(program, "uAmbientProduct");
const uDiffuseProductLoc = gl.getUniformLocation(program, "uDiffuseProduct");
const uSpecularProductLoc = gl.getUniformLocation(program, "uSpecularProduct");
const uShininessLoc = gl.getUniformLocation(program, "uShininess");

// scene / camera / lighting state (kept minimal for Phong demo)
let near = 0.1;
let far = 100.0;

let lightPosition = vec4(5.0, 10.0, 5.0, 1.0);
let lightAmbient = vec4(0.3, 0.3, 0.3, 1.0);
let lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
let lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

let materialAmbient = vec4(0.1, 0.1, 0.3, 1.0);
let materialDiffuse = vec4(0.2, 0.2, 0.6, 1.0);
let materialSpecular = vec4(0.8, 0.8, 0.8, 1.0);
let materialShininess = 50.0;

// gui-controlled values
let camX = 13;
let camY = 7;
let camZ = -11;

let lightX = 2;
let lightY = 4;
let lightZ = 2;
lightPosition = vec4(lightX, lightY, lightZ, 0.0);

// model / view / projection
let modelViewMatrix, projectionMatrix;
let eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// wire up GUI and start
addEventListeners(); // eventHandlers.js
requestAnimationFrame(render);

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // camera / matrices
  eye = vec3(camX, camY, camZ);
  modelViewMatrix = lookAt(eye, at, up);
  const fovy = 60;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  projectionMatrix = perspective(fovy, aspect, near, far); // MVnew.js

  // lighting (from GUI)
  lightPosition = vec4(lightX, lightY, lightZ, 0.0);

  // upload lighting & material products
  gl.uniform4fv(uLightPositionLoc, flatten(lightPosition));
  gl.uniform4fv(
    uAmbientProductLoc,
    flatten(mult(lightAmbient, materialAmbient))
  );
  gl.uniform4fv(
    uDiffuseProductLoc,
    flatten(mult(lightDiffuse, materialDiffuse))
  );
  gl.uniform4fv(
    uSpecularProductLoc,
    flatten(mult(lightSpecular, materialSpecular))
  );
  gl.uniform1f(uShininessLoc, materialShininess);

  // upload matrices & normal matrix
  gl.uniformMatrix4fv(uModelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(uProjectionMatrixLoc, false, flatten(projectionMatrix));
  gl.uniformMatrix3fv(
    uNormalMatrixLoc,
    false,
    flatten(normalMatrix(modelViewMatrix, true))
  );

  // draw terrain mesh (attributes already bound)
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 4);

  requestAnimationFrame(render);
}
