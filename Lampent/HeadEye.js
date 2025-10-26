export class LampentHeadEye {
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

    // Warna kuning (R,G,B)
    color = [1, 1, 0],

    // Parameter bentuk
    radius = 0.1, // Jari-jari lingkaran
    height = 0.01, // Tinggi tabung
    segments = 360 // Jumlah segmen keliling
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    /*========================= Tabung ========================= */
    // Build vertex
    this.vertex.push(0, 0, height / 2); // Pusat lingkaran atas
    this.vertex.push(color[0], color[1], color[2]); // top color

    this.vertex.push(0, 0, -height / 2); // Pusat lingkaran bawah
    this.vertex.push(color[0], color[1], color[2]); // bottom color

    // Loop bikin vertex di keliling atas dan bawah
    for (let i = 0; i <= segments; i++) {
      let theta = (2 * Math.PI * i) / segments; // Sudut rotasi tiap segmen

      // Posisi titik di keliling lingkaran
      let x = radius * Math.cos(theta);
      let y = radius * Math.sin(theta);
      let zTop = height / 2;
      let zBottom = -height / 2;

      // Titik di lingkaran atas
      this.vertex.push(x, y, zTop);
      this.vertex.push(color[0], color[1], color[2]);

      // Titik di lingkaran bawah
      this.vertex.push(x, y, zBottom);
      this.vertex.push(color[0], color[1], color[2]);
    }

    // Build Faces
    for (let i = 0; i < segments; i++) {
      let top1 = i * 2; // Titik keliling atas segmen saat ini
      let top2 = ((i + 1) % segments) * 2; // Titik keliling atas segmen berikutnya

      let bottom1 = top1 + 1; // Titik keliling bawah segmen saat ini
      let bottom2 = top2 + 1; // Titik keliling bawah segmen berikutnya

      // Side faces
      this.faces.push(top1, bottom1, bottom2);
      this.faces.push(top1, bottom2, top2);

      // Top face
      this.faces.push(top1, top2, segments * 2);

      // Bottom face
      this.faces.push(bottom1, segments * 2 + 1, bottom2);
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
