export class Fence {
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

    barWidth = 0.05, // lebar
    barHeight = 2.0, // tinggi
    spacing = 0.1, // jarak antara
    barCount = 40 // total besi
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    /*========================= Steel Fence ========================= */

    // Loop untuk membuat tiap batang pagar
    for (let i = 0; i < barCount; i++) {
      let x = i * spacing; // posisi X

      // Setengah lebar dan tinggi batang
      let hw = barWidth / 2;
      let hh = barHeight;

      // Vertex batang
      // prettier-ignore
      let baseVertices = [
        // Depan
        x - hw, 0, hw,    0.1, 0.1, 0.1,
        x + hw, 0, hw,    0.1, 0.1, 0.1,
        x + hw, hh, hw,   0.1, 0.1, 0.1,
        x - hw, hh, hw,   0.1, 0.1, 0.1,

        // Belakang
        x - hw, 0, -hw,   0.1, 0.1, 0.1,
        x + hw, 0, -hw,   0.1, 0.1, 0.1,
        x + hw, hh, -hw,  0.1, 0.1, 0.1,
        x - hw, hh, -hw,  0.1, 0.1, 0.1,
      ];

      // Simpan vertex
      this.vertex.push(...baseVertices); // "..." = spread operator

      // Indeks awal vertex batang ini
      let baseIndex = i * 8;

      // Build  faces (2 triangles = 1 box)
      // prettier-ignore
      this.faces.push(
        // depan
        baseIndex + 0, baseIndex + 1, baseIndex + 2,
        baseIndex + 0, baseIndex + 2, baseIndex + 3,

        // kanan
        baseIndex + 1, baseIndex + 5, baseIndex + 6,
        baseIndex + 1, baseIndex + 6, baseIndex + 2,

        // belakang
        baseIndex + 5, baseIndex + 4, baseIndex + 7,
        baseIndex + 5, baseIndex + 7, baseIndex + 6,

        // kiri
        baseIndex + 4, baseIndex + 0, baseIndex + 3,
        baseIndex + 4, baseIndex + 3, baseIndex + 7,

        // Top
        baseIndex + 3, baseIndex + 2, baseIndex + 6,
        baseIndex + 3, baseIndex + 6, baseIndex + 7,

        // Bottom
        baseIndex + 4, baseIndex + 5, baseIndex + 1,
        baseIndex + 4, baseIndex + 1, baseIndex + 0
      );
    }
  }
  setup() {
    this.OBJECT_VERTEX = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(this.vertex), this.GL.STATIC_DRAW);

    this.OBJECT_FACES = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), this.GL.STATIC_DRAW);

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
