export class LampentHatParaboloid {
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

    // warna
    color = [0.075, 0, 0.15],

    // param: radius (di bagian atas), height (tinggi), radialSegments (jumlah segmen melingkar)
    paraboloidRadius = 5,
    paraboloidHeight = 5,
    segments = 360
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    /*========================= Paraboloid Eliptik ========================= */
    const rings = 30; // Jumlah cincin (vertikal) yang membentuk paraboloid

    // Koefisien parabola: mengontrol seberapa cepat bentuk melengkung
    const a = paraboloidHeight / (paraboloidRadius * paraboloidRadius);

    // Simpan index awal vertex
    const baseIndex = this.vertex.length / 6;

    // Build vertex paraboloid (runcing ke atas)
    for (let i = 0; i <= rings; i++) {
      const t = i / rings; // posisi vertikal ring dari atas ke bawah
      const r = paraboloidRadius * (1 - t); // radius mengecil
      // const y = paraboloidHeight / 2 + a * (r * r);        // runcing di bawah
      const y = paraboloidHeight / 2 - a * Math.pow(r, 1.5); // runcing di atas

      // Loop untuk build vertex melingkar pada cincin
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2; // sudut melingkar 0–360°
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;

        // Simpan posisi dan warna
        this.vertex.push(x, y, z, color[0], color[1], color[2]);
      }
    }

    // Build faces paraboloid
    for (let i = 0; i < rings; i++) {
      for (let j = 0; j < segments; j++) {
        // Hitung indeks empat titik pada dua cincin yang berdekatan
        const p1 = baseIndex + i * (segments + 1) + j;
        const p2 = baseIndex + (i + 1) * (segments + 1) + j;
        const p3 = baseIndex + (i + 1) * (segments + 1) + (j + 1);
        const p4 = baseIndex + i * (segments + 1) + (j + 1);

        // Buat 2 segitiga untuk membentuk 1 panel permukaan
        this.faces.push(p1, p2, p3);
        this.faces.push(p1, p3, p4);
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
    this.GL.vertexAttribPointer(this._position, 3, this.GL.FLOAT, false, 24, 0);
    this.GL.vertexAttribPointer(this._color, 3, this.GL.FLOAT, false, 24, 12);

    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    this.GL.drawElements(this.GL.TRIANGLES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);
    // this.GL.drawElements(this.GL.LINES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);

    this.childs.forEach((child) => child.render(this.MODEL_MATRIX));
  }
}
