export class GraveArch {
  GL = null;
  SHADER_PROGRAM = null;

  _position = null;
  _color = null;
  _MMatrix = null;

  OBJECT_VERTEX = null;
  OBJECT_FACES = null;

  vertex = [];
  faces = [];

  POSITION_MATRIX = LIBS.get_I4();
  MOVE_MATRIX = LIBS.get_I4();

  childs = [];

  constructor(
  GL,
  SHADER_PROGRAM,
  _position,
  _color,
  _Mmatrix,

  // Gate parameters
  width = 2,
  height = 3,
  thickness = 0.2,
  segments = 60
) {
  this.GL = GL;
  this.SHADER_PROGRAM = SHADER_PROGRAM;
  this._position = _position;
  this._color = _color;
  this._MMatrix = _Mmatrix;

  this.vertex = [];
  this.faces = [];

  const halfWidth = width / 2;
  const archRadius = halfWidth;
  const straightHeight = height - archRadius; // flat wall height before rounding
  const zFront = thickness / 2;
  const zBack = -thickness / 2;

  // === FRONT FACE ===

  // Left vertical side (bottom to start of arc)
  this.vertex.push(-halfWidth, 0, zFront);   // 0
  this.vertex.push(0.6, 0.6, 0.6);
  this.vertex.push(-halfWidth, straightHeight, zFront); // 1
  this.vertex.push(0.6, 0.6, 0.6);

  // Right vertical side
  this.vertex.push(halfWidth, 0, zFront);    // 2
  this.vertex.push(0.6, 0.6, 0.6);
  this.vertex.push(halfWidth, straightHeight, zFront);  // 3
  this.vertex.push(0.6, 0.6, 0.6);

  // Top arch (semi-circle)
  const arcStartIndex = this.vertex.length / 6;
  for (let i = 0; i <= segments; i++) {
    const theta = Math.PI * (i / segments);
    const x = Math.cos(theta) * archRadius;
    const y = Math.sin(theta) * archRadius + straightHeight;
    this.vertex.push(x, y, zFront);
    this.vertex.push(0.6, 0.6, 0.6);
  }

  // === BACK FACE === (duplicate all front face vertices, but z = back)
  const frontVertexCount = this.vertex.length / 6;
  for (let i = 0; i < frontVertexCount; i++) {
    const x = this.vertex[i * 6 + 0];
    const y = this.vertex[i * 6 + 1];
    this.vertex.push(x, y, zBack);
    this.vertex.push(0.6, 0.6, 0.6);
  }

  // === FACES ===

  // Front face triangles (gate front surface)
  // Left rectangle
  this.faces.push(0, 1, 3);
  this.faces.push(0, 3, 2);

  // Top arch (fan style from one side to the other)
  for (let i = 0; i < segments; i++) {
    const p1 = arcStartIndex + i;
    const p2 = arcStartIndex + i + 1;
    this.faces.push(1, p1, p2); // Triangle fan from top-left
  }

  // Back face (same as front, but reversed winding)
  const offset = frontVertexCount;

  // Back - Left rectangle
  this.faces.push(offset + 3, offset + 1, offset + 0);
  this.faces.push(offset + 2, offset + 3, offset + 0);

  // Back - Top arch
  for (let i = 0; i < segments; i++) {
    const p1 = offset + arcStartIndex + i;
    const p2 = offset + arcStartIndex + i + 1;
    this.faces.push(offset + 1, p2, p1); // Reversed triangle fan
  }

  // === SIDE WALLS === (connect front and back)
  for (let i = 0; i < frontVertexCount; i++) {
    const next = (i + 1) % frontVertexCount;
    const f1 = i;
    const f2 = next;
    const b1 = i + offset;
    const b2 = next + offset;

    // Skip last to first if next loops around
    if (next === 0 || next === 1 || next === 2 || next === 3) continue;

    this.faces.push(f1, b1, b2);
    this.faces.push(f1, b2, f2);
  }

  // Side walls for flat bottom and sides (0-3)
  const wallPairs = [
    [0, 1],
    [1, arcStartIndex], // up left
    [arcStartIndex + segments, 3], // up right
    [3, 2],
    [2, 0],
  ];

  wallPairs.forEach(([f1, f2]) => {
    const b1 = f1 + offset;
    const b2 = f2 + offset;

    this.faces.push(f1, b1, b2);
    this.faces.push(f1, b2, f2);
  });
}
  setup() {
    this.OBJECT_VERTEX = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(this.vertex), this.GL.STATIC_DRAW);

    this.OBJECT_FACES = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    this.GL.bufferData(
      this.GL.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.faces),
      this.GL.STATIC_DRAW
    );

    this.childs.forEach((child) => child.setup());
  }

  render(PARENT_MATRIX) {
    this.MODEL_MATRIX = LIBS.multiply(this.MOVE_MATRIX, this.POSITION_MATRIX);
    this.MODEL_MATRIX = LIBS.multiply(this.MODEL_MATRIX, PARENT_MATRIX);

    this.GL.useProgram(this.SHADER_PROGRAM);
    this.GL.uniformMatrix4fv(this._MMatrix, false, this.MODEL_MATRIX);

    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    this.GL.vertexAttribPointer(this._position, 3, this.GL.FLOAT, false, 24, 0);
    this.GL.vertexAttribPointer(this._color, 3, this.GL.FLOAT, false, 24, 12);

    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    this.GL.drawElements(this.GL.TRIANGLES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);
    // this.GL.drawElements(this.GL.LINES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);

    this.childs.forEach((child) => child.render(this.MODEL_MATRIX));
  }
}
