export class Scalp {
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
    Color = [0.9,0.91,0.91, 0.4],

    a = 0.625, // base radius (at the cone/paraboloid joint)
    b = 0.7, // total height
    c = 0.7, // depth (used for scaling symmetry - unused in this surface of revolution)
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

    /*========================= Truncated Cone with Paraboloid Cover =========================*/

    const H_total = b;
    const H_para = 0.4 * H_total; // Height of the paraboloid cover (50% of total height)
    const H_cone = H_total - H_para; // Height of the truncated cone section

    // Y coordinate where the paraboloid ends and the cone begins.
    const Y_join = -H_total / 2 + H_para;
    const R_join = a; // Radius at the join point
    const R_top = a * 0.9; // Radius at the top of the cone

    for (let i = 0; i <= vSeg; i++) {
      let v = i / vSeg; // Normalized segment height (0 to 1)

      let y;
      let radius;

      // Paraboloid Cover Section (v * H_total is less than or equal to H_para)
      if (v * H_total <= H_para) {
        // y_local ranges from 0 (bottom apex) to H_para (join)
        let y_local = v * H_total;

        // Parabola equation: r = R_join * sqrt(y_local / H_para)
        // This creates a smooth curve from a point at the bottom to radius 'a' at the join.
        if (y_local < 0) y_local = 0; // Safety clamp
        radius = R_join * Math.sqrt(y_local / H_para);

        // Global Y position, ranging from -H_total/2 to Y_join
        y = -H_total / 2 + y_local;
      }
      // Truncated Cone Section
      else {
        // y_local_cone ranges from 0 (join) to H_cone (top)
        let y_local_cone = v * H_total - H_para;

        // t goes from 0 (at join) to 1 (at top)
        let t = y_local_cone / H_cone;

        // Linear interpolation of radius (Cone shape)
        radius = R_join + (R_top - R_join) * t;

        // Global Y position, ranging from Y_join to H_total/2
        y = Y_join + y_local_cone;
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