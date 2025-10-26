export class LampentHead {
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

    // Warna objek (R, G, B, Alpha)
    color = [0.4, 0.4, 1, 0.4],

    a = 0.7, // Skala sumbu X
    b = 0.7, // Skala sumbu Y
    c = 0.7, // Skala sumbu Z
    uSeg = 360, // Jumlah segmen horizontal (keliling)
    vSeg = 60 // Jumlah segmen vertikal (dari atas ke bawah)
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    /*========================= Ellipsoid (mirip bola) ========================= */
    // Build vertex Loop
    for (let i = 0; i <= vSeg; i++) {
      let phi = (Math.PI * i) / vSeg; // phi = sudut vertikal (keliling)
      for (let j = 0; j <= uSeg; j++) {
        let theta = (2 * Math.PI * j) / uSeg; // theta = sudut horizontal

        // Rumus posisi titik di ellipsoid
        let x = a * Math.sin(phi) * Math.cos(theta);
        let y = b * Math.sin(phi) * Math.sin(theta);
        let z = c * Math.cos(phi);

        // Simpan posisi dan warna vertex
        this.vertex.push(x, y, z);
        this.vertex.push(color[0], color[1], color[2], color[3]);
      }
    }

    // Build Faces (2 triangles = box)
    for (let i = 0; i < vSeg; i++) {
      for (let j = 0; j < uSeg; j++) {
        // vertex di grid
        let p1 = i * (uSeg + 1) + j;
        let p2 = p1 + 1;
        let p3 = p1 + (uSeg + 1);
        let p4 = p3 + 1;

        // build 2 segitiga dari empat titik
        this.faces.push(p1, p2, p4);
        this.faces.push(p1, p4, p3);
      }
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
    this.GL.vertexAttribPointer(this._position, 3, this.GL.FLOAT, false, 28, 0);
    this.GL.vertexAttribPointer(this._color, 4, this.GL.FLOAT, false, 28, 12);

    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    this.GL.drawElements(this.GL.TRIANGLES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);
    // this.GL.drawElements(this.GL.LINES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);

    this.childs.forEach((child) => child.render(this.MODEL_MATRIX));
  }
}
