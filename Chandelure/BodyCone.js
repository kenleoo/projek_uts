export class BodyCone {
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

    // param: radius (di bagian atas), height (tinggi), radialSegments (jumlah segmen melingkar)
    radius = 4,
    height = 2.5,
    radialSegments = 360
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    /*========================= Upside-down cone (penyangga kepala) ========================= */
    // Build vertex
    const halfH = height / 2;
    const bottomY = -halfH; // posisi titik puncak kerucut (bagian bawah)
    const topY = halfH; // posisi titik lingkaran atas

    // Titik pusat lingkaran atas (digunakan untuk membentuk permukaan datar bagian atas)
    this.vertex.push(0, topY, 0, 0, 0, 0); // Warna: hitam

    // Titik di keliling lingkaran atas
    for (let i = 0; i < radialSegments; i++) {
      const theta = (i / radialSegments) * Math.PI * 2;
      const x = Math.cos(theta) * radius; // posisi X pada lingkaran
      const z = Math.sin(theta) * radius; // posisi Z pada lingkaran

      this.vertex.push(x, topY, z, 0, 0, 0); // Warna: hitam
    }

    // Titik pusat di bagian bawah kerucut
    const apexIndex = this.vertex.length / 6;
    this.vertex.push(0, bottomY, 0, 0, 0, 0); // Warna: hitam

    // Build faces 
    // lingkaran atas
    // for (let i = 1; i <= radialSegments; i++) {
    //   const a = 0;
    //   const b = i;
    //   const c = (i % radialSegments) + 1;
    //   this.faces.push(a, b, c);
    // }

    // sisi cone
    for (let i = 1; i <= radialSegments; i++) {
      const b = i;
      const c = (i % radialSegments) + 1;
      this.faces.push(b, c, apexIndex);
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
