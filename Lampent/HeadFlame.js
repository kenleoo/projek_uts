export class LampentHeadFlame {
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

    color = [0.10, 0.11, 0.50, 0.8],

    base_radius = 0.2,      // base radius
    height = 1.2,      // flame height
    uSeg = 32,    // radial segments
    vSeg = 60     // vertical segments
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _MMatrix;

    this.vertex = [];
    this.faces = [];

    for (let i = 0; i <= vSeg; i++) {
      const t = i / vSeg;
      const z = height * t;

      // Flame profile: tapering + bulges
      const taper = 1 - t;
      const bulge = 1.2;
      const radius = base_radius * taper * bulge;
      

      const offsetX = 0.1 * Math.sin(2 * Math.PI * t) + 0.15 * t;
      const offsetY = 0.1 * Math.cos(2 * Math.PI * t) + 0.15 * t;

      for (let j = 0; j <= uSeg; j++) {
        const theta = (j / uSeg) * 2 * Math.PI;

        const x = offsetX + radius * Math.cos(theta);
        const y = offsetY + radius * Math.sin(theta);

        this.vertex.push(x, y, z);

        // Single constant color - light blue
        this.vertex.push(color[0], color[1],color[2],color[3]);
      }
    }

    // Create triangle faces (quads split into 2 triangles)
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
    this.GL.vertexAttribPointer(this._position, 3, this.GL.FLOAT, false, 28, 0);
    this.GL.vertexAttribPointer(this._color, 4, this.GL.FLOAT, false, 28, 12);

    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    this.GL.drawElements(this.GL.TRIANGLES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);

    this.childs.forEach((child) => child.render(this.MODEL_MATRIX));
  }
}