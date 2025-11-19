export class CrossGravestone {
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
    _MMatrix,
    width = 1,
    height = 5,
    depth = 0.5,
    barWidth = 3,
    barHeight = 1
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _MMatrix;

    const gray = [0.3, 0.3, 0.3];

    // ============================================================
    // Helper function: Creates a rectangular box
    // centerX, centerY, centerZ = center of box
    // w, h, d = dimensions
    // returns index start for faces construction
    // ============================================================
    const buildBox = (centerX, centerY, centerZ, w, h, d) => {
      const hw = w / 2, hh = h / 2, hd = d / 2;
      const startIndex = this.vertex.length / 6;

      const cubeVerts = [
        // back
        [centerX - hw, centerY - hh, centerZ - hd, ...gray],
        [centerX + hw, centerY - hh, centerZ - hd, ...gray],
        [centerX + hw, centerY + hh, centerZ - hd, ...gray],
        [centerX - hw, centerY + hh, centerZ - hd, ...gray],

        // front
        [centerX - hw, centerY - hh, centerZ + hd, ...gray],
        [centerX + hw, centerY - hh, centerZ + hd, ...gray],
        [centerX + hw, centerY + hh, centerZ + hd, ...gray],
        [centerX - hw, centerY + hh, centerZ + hd, ...gray],
      ];

      this.vertex.push(...cubeVerts.flat());

      const faces = [
        [0, 1, 2], [0, 2, 3],
        [4, 5, 6], [4, 6, 7],
        [0, 4, 7], [0, 7, 3],
        [1, 5, 6], [1, 6, 2],
        [3, 2, 6], [3, 6, 7],
        [0, 1, 5], [0, 5, 4],
      ];

      for (let f of faces)
        this.faces.push(startIndex + f[0], startIndex + f[1], startIndex + f[2]);
    };

    // ============================================================
    // Cross geometry parts
    // ============================================================

    // Vertical beam
    buildBox(0, height / 2, 0, width, height, depth);

    // Horizontal beam (centered horizontally, placed around upper area)
    buildBox(0, height * 0.65, 0, barWidth, barHeight, depth);
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

    this.childs.forEach((child) => child.render(this.MODEL_MATRIX));
  }
}
