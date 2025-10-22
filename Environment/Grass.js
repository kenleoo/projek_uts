export class DirtGrassLand {
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
    width = 60,
    height = 2,
    depth = 60,
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

   // Create vertices for a flat rectangular land (grass on top, dirt on sides and bottom)
    const halfW = width / 2;
    const halfH = height / 2;
    const halfD = depth / 2;
    const uSeg = 360; // segments along width
    const vSeg = 1;   // segments along depth
    // Top face (grass)
    for (let i = 0; i <= vSeg; i++) {
      let z = -halfD + (i / vSeg) * depth;
        for (let j = 0; j <= uSeg; j++) {
            let x = -halfW + (j / uSeg) * width;
            this.vertex.push(x, halfH, z); // position
            this.vertex.push(0.01, 0.1, 0.2); // grass green color
        }
    }
    // bottom face (dirt)
    for (let i = 0; i <= vSeg; i++) {
      let z = -halfD + (i / vSeg) * depth;
        for (let j = 0; j <= uSeg; j++) {
            let x = -halfW + (j / uSeg) * width;
            this.vertex.push(x, -halfH, z); // position
            this.vertex.push(0.35, 0.16, 0.05); // dirt brown color
        }
    }

    // Generate faces (triangles)
    // Top face
    for (let i = 0; i < vSeg; i++) {
      for (let j = 0; j < uSeg; j++) {
        let p1 = i * (uSeg + 1) + j;
        let p2 = p1 + (uSeg + 1);
        let p3 = p2 + 1;
        let p4 = p1 + 1;
        this.faces.push(p1, p2, p4);
        this.faces.push(p2, p3, p4);
        }
    }

    // bottom face
    for (let i = 0; i < vSeg; i++) {
      for (let j = 0; j < uSeg; j++) {
        let p1 = (vSeg + 1) * (uSeg + 1) + i * (uSeg + 1) + j;
        let p2 = p1 + (uSeg + 1);
        let p3 = p2 + 1;
        let p4 = p1 + 1;
        this.faces.push(p1, p4, p2);
        this.faces.push(p2, p4, p3);
        }
    }

    // grass and dirt sides faces met
    for (let j = 0; j < uSeg; j++) {
      let topP1 = j;
      let topP2 = (uSeg + 1) + j;
      let bottomP1 = (vSeg + 1) * (uSeg + 1) + j;
      let bottomP2 = (vSeg + 1) * (uSeg + 1) + (uSeg + 1) + j;
      this.faces.push(topP1, bottomP1, topP2);
      this.faces.push(topP2, bottomP1, bottomP2);
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
