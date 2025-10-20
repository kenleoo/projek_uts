export class HeadVerticalStrip {
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
    a = 0.5251,
    b = 0.5251,
    c = 0.451,
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

    /*========================= Upside-down cone (penyangga kepala) ========================= */
    // Build vertex
   for (let i = 0; i <= vSeg; i++) {
            let phi = Math.PI * i / vSeg; // 0 to π
            for (let j = 0; j <= uSeg; j++) {
                let theta = 2 * Math.PI * j / uSeg; // 0 to 2π

                let x = a * Math.sin(phi) * Math.cos(theta);
                let y = b * Math.sin(phi) * Math.sin(theta);
                let z = c * Math.cos(phi);

                this.vertex.push(x, y, z);
                this.vertex.push(0.075, 0, 0.15);

            }
        }

        // Faces (triangles)
        for (let i = 0; i < vSeg; i++) {
            for (let j = 0; j < uSeg; j++) {
                let p1 = i * (uSeg + 1) + j;
                let p2 = p1 + 1;
                let p3 = p1 + (uSeg + 1);
                let p4 = p3 + 1;

                //create 1 horizontal strip with black color only infront
                if((i == Math.floor(vSeg/2) && (j >= 135 && j <= 225))) {
                    this.faces.push(p1, p3, p4);
                    this.faces.push(p1, p4, p2);
                }

    
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
    this.GL.drawElements(this.GL.TRIANGLES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);
    // this.GL.drawElements(this.GL.LINES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);

    this.childs.forEach((child) => child.render(this.MODEL_MATRIX));
  }
}
