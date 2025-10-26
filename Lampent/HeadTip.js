export class LampentHeadTip {
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

    a = 0.19, // base radius
    c = 1.75, // height
    uSeg = 60, // radial segments
    vSeg = 360 // vertical segments
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _MMatrix;

    this.vertex = [];
    this.faces = [];

    const base_radius = a;
    const height = c;

    // Loop build lapisan dari bawah ke atas
    for (let i = 0; i <= vSeg; i++) {
      const t = i / vSeg; // posisi vertikal
      const z = height * t;

      // Radius mengecil ke atas → ujung lebih runcing
      const taper = Math.sqrt(1 - t); // membuat ujung tumpul / curve
      const bulge = 0.8 + 0.2 * Math.sin(Math.PI * t); // sedikit membesar di tengah
      const radius = base_radius * taper * bulge;

      // kalo mau di spiral
      const offsetX = 0;
      const offsetY = 0;

      // build vertex lingkaran di lapisan ini
      for (let j = 0; j <= uSeg; j++) {
        const theta = (j / uSeg) * 2 * Math.PI;

        const x = offsetX + radius * Math.cos(theta);
        const y = offsetY + radius * Math.sin(theta);

        // Simpan vertex (posisi + warna)
        this.vertex.push(x, y, z);
        this.vertex.push(0.075, 0, 0.15, 1);
      }
    }

    // Build Faces
    for (let i = 0; i < vSeg; i++) {
      for (let j = 0; j < uSeg; j++) {
        let p1 = i * (uSeg + 1) + j;
        let p2 = p1 + 1;
        let p3 = p1 + (uSeg + 1);
        let p4 = p3 + 1;

        this.faces.push(p1, p3, p4);
        this.faces.push(p1, p4, p2);
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
