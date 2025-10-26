export class HeadEye {
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
    height = 0.025,
    segments = 360
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    /*========================= silinder mata ========================= */
    // Build vertex
    this.vertex.push(0, 0, height / 2);    // top center
    this.vertex.push(1, 1, 0);             // top color

    this.vertex.push(0, 0, -height / 2);   // bottom center
    this.vertex.push(1, 1, 0);             // bottom color

    for (let i = 0; i <= segments; i++) {
        let theta = 2 * Math.PI * i / segments;
        let x = radius * Math.cos(theta);
        let y = radius * Math.sin(theta);
        let zTop = height / 2;
        let zBottom = -height / 2;

        this.vertex.push(x, y, zTop);
        this.vertex.push(1, 1, 0); // Yellow
        // Bottom circle
        this.vertex.push(x, y, zBottom);
        this.vertex.push(1, 1, 0); // Yellow
        
    }
    // Faces
    for (let i = 0; i < segments; i++) {
        let top1 = i * 2;
        let bottom1 = top1 + 1;
        let top2 = ((i + 1) % segments) * 2;
        let bottom2 = top2 + 1;
        // Side
        this.faces.push(top1, bottom1, bottom2);
        this.faces.push(top1, bottom2, top2);
        // Top
        this.faces.push(top1, top2, (segments * 2));
        // Bottom
        this.faces.push(bottom1, (segments * 2) + 1, bottom2);
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
