export class Head {
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
    Color = [0.87,0.88,0.88, 0.4],

    a = 0.6, // base radius
    b = 0.9, // height
    c = 0.7, // depth (used for scaling symmetry)
    uSeg = 360,
    vSeg = 60
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];
    

    /*========================= Truncated cone with rounded base =========================*/

    const height = b; // total height
    const roundHeight = 0.5 * height; // height of rounded base
    const coneHeight = height - roundHeight;

    for (let i = 0; i <= vSeg; i++) {
      let v = i / vSeg;

      let y;
      let radius;

      // Rounded bottom part (using sine smoothing)
      if (v < roundHeight / height) {
        let t = v * height / roundHeight; // 0–1 range for round
        y = -height / 2 + roundHeight * (t - 1); 
        radius = a + (Math.sin((t * Math.PI) / 2) * 0.2 * a); // smooth bulge at base
      } 
      // Main truncated cone body
      else {
        let t = (v - roundHeight / height) / (coneHeight / height);
        y = -height / 2 + roundHeight + coneHeight * t;

        const baseR = a;
        const topR = a * 0.6; // smaller top
        radius = baseR + (topR - baseR) * t;
      }

      for (let j = 0; j <= uSeg; j++) {
        let theta = (2 * Math.PI * j) / uSeg;
        let x = radius * Math.cos(theta);
        let z = radius * Math.sin(theta);

        this.vertex.push(x, y, z);
        this.vertex.push(Color[0], Color[1], Color[2], Color[3]);
      }
    }

    // Faces (triangles)
    for (let i = 0; i < vSeg; i++) {
      for (let j = 0; j < uSeg; j++) {
        let p1 = i * (uSeg + 1) + j;
        let p2 = p1 + 1;
        let p3 = p1 + (uSeg + 1);
        let p4 = p3 + 1;

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
