export class SubHand {
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

  R = 2,       // radius torus
  r = 0.075,       // radius tube torus
  uSeg = 300,   
  vSeg = 60,     
  arc = Math.PI * 0.5  //1/2 bagian torus
) {
  this.GL = GL;
  this.SHADER_PROGRAM = SHADER_PROGRAM;
  this._position = _position;
  this._color = _color;
  this._MMatrix = _Mmatrix;

  this.vertex = [];
  this.faces = [];

  //vertex
  for (let i = 0; i <= uSeg; i++) {
    let u = (i / uSeg) * arc;
    for (let j = 0; j <= vSeg; j++) {
      let v = (j / vSeg) * 2 * Math.PI;

      let x = (R + r * Math.cos(v)) * Math.cos(u);
      let y = (R + r * Math.cos(v)) * Math.sin(u);
      let z = r * Math.sin(v);

      this.vertex.push(x, y, z);
      this.vertex.push(0.075, 0, 0.15);
    }
  }

  // face
  for (let i = 0; i < uSeg; i++) {
    for (let j = 0; j < vSeg; j++) {
      let p1 = i * (vSeg + 1) + j;
      let p2 = p1 + 1;
      let p3 = p1 + (vSeg + 1);
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
    this.GL.vertexAttribPointer(this._position, 3, this.GL.FLOAT, false, 24, 0);
    this.GL.vertexAttribPointer(this._color, 3, this.GL.FLOAT, false, 24, 12);

    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    // this.GL.drawElements(this.GL.TRIANGLES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);
    this.GL.drawElements(this.GL.LINES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);

    this.childs.forEach((child) => child.render(this.MODEL_MATRIX));
  }
}
