export class BodyClylinder {
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
    radius = 0.1,
    height = 0.15,
    segments = 72,
    roundFactor = 0.25, // proportion of total height used for rounding
    roundSegments = 12, // how many vertical divisions for the rounded parts
    Color = [0.95,0.95,0.85]
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    /*========================= Rounded Cylinder (Capsule-like) =========================*/

    const halfH = height / 2;
    const roundH = height * roundFactor;
    const straightH = height - 2 * roundH;
    const totalVSeg = roundSegments * 2 + 1;
    const ringVerts = segments + 1;

    for (let i = 0; i <= totalVSeg; i++) {
      let y, r;

      // bottom rounded arc
      if (i < roundSegments) {
        const t = i / roundSegments;
        y = -halfH + roundH * (1 - Math.cos((t * Math.PI) / 2));
        r = radius * Math.sin((t * Math.PI) / 2);
      }
      // middle straight body
      else if (i <= roundSegments + 1) {
        const t = (i - roundSegments) / (totalVSeg - 2 * roundSegments);
        y = -halfH + roundH + straightH * t;
        r = radius;
      }
      // top rounded arc
      else {
        const t = (i - (totalVSeg - roundSegments)) / roundSegments;
        y = halfH - roundH * (1 - Math.cos((t * Math.PI) / 2));
        r = radius * Math.sin((Math.PI / 2) + (t * Math.PI) / 2);
      }

      // ring around Y-axis
      for (let j = 0; j <= segments; j++) {
        const theta = (2 * Math.PI * j) / segments;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        this.vertex.push(x, y, z, Color[0], Color[1], Color[2]);
      }
    }

    // Build faces between rings
    for (let i = 0; i < totalVSeg; i++) {
      for (let j = 0; j < segments; j++) {
        const p1 = i * ringVerts + j;
        const p2 = p1 + 1;
        const p3 = p1 + ringVerts;
        const p4 = p3 + 1;
        this.faces.push(p1, p3, p2);
        this.faces.push(p2, p3, p4);
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

    this.childs.forEach((child) => child.render(this.MODEL_MATRIX));
  }
}
