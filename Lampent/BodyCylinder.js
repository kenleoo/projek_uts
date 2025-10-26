export class LampentBodyClylinder {
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
    radius = 0.1,
    height = 0.15,
    segments = 360
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    /*========================= Clylinder (body) ========================= */
    // Build vertex
    for (let i = 0; i <= segments; i++) {
      let theta = (2 * Math.PI * i) / segments;
      let x = radius * Math.cos(theta);
      let z = radius * Math.sin(theta);
      let yTop = height / 2;
      let yBottom = -height / 2;

      // titik top ring
      this.vertex.push(x, yTop, z);
      this.vertex.push(0.075, 0, 0.15); // color

      // titik bottom ring
      this.vertex.push(x, yBottom, z);
      this.vertex.push(0.075, 0, 0.15); // color
    }

    // titik pusat top and bottom ringg
    const topCenterIndex = this.vertex.length / 6;
    this.vertex.push(0, height / 2, 0, 0.075, 0, 0.15); // top
    const bottomCenterIndex = topCenterIndex + 1;
    this.vertex.push(0, -height / 2, 0, 0.075, 0, 0.15); // bottom

    // Faces
    for (let i = 0; i < segments; i++) {
      const top1 = i * 2;
      const bottom1 = top1 + 1;
      const top2 = ((i + 1) % segments) * 2;
      const bottom2 = top2 + 1;

      // Side faces
      this.faces.push(top1, bottom1, bottom2);
      this.faces.push(top1, bottom2, top2);

      // Top face
      // this.faces.push(top1, top2, topCenterIndex);

      // Bottom face
      this.faces.push(bottom1, bottomCenterIndex, bottom2);
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
