function createBuffer(
  gl,
  data,
  type = gl.ARRAY_BUFFER,
  usage = gl.STATIC_DRAW
) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, data, usage);
  return buffer;
}

function bindBuffer(
  gl,
  buffer,
  attribute,
  size,
  type = gl.FLOAT,
  normalize = false,
  stride = 0,
  offset = 0
) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(attribute, size, type, normalize, stride, offset);
  gl.enableVertexAttribArray(attribute);
}
