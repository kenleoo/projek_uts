export class HandCrown {
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
  crownRadius = 1.5,
  crownHeight = 1,
  segments = 8 // jumlah gigi mahkota
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _MMatrix;

    this.vertex = [];
    this.faces = [];

    const baseIndex = 0;

    // Tambahkan vertex bawah dan atas mahkota
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * crownRadius;
      const z = Math.sin(theta) * crownRadius;

      // Vertex bawah
      const yBottom = -crownHeight / 2;
      this.vertex.push(x, yBottom, z, 0.075, 0, 0.15); // hitam

      // Vertex atas (naik-turun untuk bentuk gigi mahkota)
      // Vertex atas (naik-turun untuk bentuk gigi mahkota)
      const isPeak = i % 2 !== 0;
      const yTop = crownHeight / 2 + (isPeak ? 0.5 : -0.5);

      // Buat ujung sedikit menjulur keluar
      const outwardFactor = isPeak ? 0 : 0; // hanya puncak (bukan lembah) yang menjulur keluar
      const xOut = Math.cos(theta) * (crownRadius + outwardFactor);
      const zOut = Math.sin(theta) * (crownRadius + outwardFactor);

      this.vertex.push(xOut, yTop, zOut, 0.075, 0, 0.15); // hitam

    }

    // Tambahkan face sisi samping (buat quad dari dua triangle)
    for (let i = 0; i < segments; i++) {
      const p1 = baseIndex + i * 2;
      const p2 = baseIndex + i * 2 + 1;
      const p3 = baseIndex + (i + 1) * 2 + 1;
      const p4 = baseIndex + (i + 1) * 2;

      this.faces.push(p1, p2, p3); // Triangle 1
      this.faces.push(p1, p3, p4); // Triangle 2
    }

    // (Optional) Tambahkan alas (bottom face) kalau ingin menutup bawah
    const centerIndex = this.vertex.length / 6;
    this.vertex.push(0, -crownHeight / 2, 0, 0.075, 0, 0.15); // pusat bawah

    for (let i = 0; i < segments; i++) {
      const p1 = centerIndex;
      const p2 = i * 2;
      const p3 = ((i + 1) % segments) * 2;
      this.faces.push(p1, p2, p3);
    }
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
