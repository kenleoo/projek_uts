export class GravestoneA {
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
    width = 2,
    height = 4,
    depth = 0.4,
    archSegments = 60
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    const gray = [0.3, 0.3, 0.3];
    const archRadius = width / 2;
    const baseHeight = height - archRadius; // box
    const zFront = depth / 2;
    const zBack = -depth / 2;

    // =====================================================
    // Box
    // =====================================================
    const baseVertices = [
      //belakang
      [-width / 2, 0, zBack, ...gray], //kiri bawah
      [width / 2, 0, zBack, ...gray],  //kanan bawah
      [width / 2, baseHeight, zBack, ...gray], //kanan atas
      [-width / 2, baseHeight, zBack, ...gray], //kiri atas
      //depan
      [-width / 2, 0, zFront, ...gray], //kiri bawah
      [width / 2, 0, zFront, ...gray],  //kanan bawah
      [width / 2, baseHeight, zFront, ...gray], //kanan atas
      [-width / 2, baseHeight, zFront, ...gray], //kiri atas
    ];

    this.vertex.push(...baseVertices.flat());

    //boc face
    const baseFaces = [
      [0, 1, 2], [0, 2, 3], //belakang
      [4, 5, 6], [4, 6, 7], //depan
      [0, 4, 7], [0, 7, 3], //kiri
      [1, 5, 6], [1, 6, 2], //kanan
      [3, 2, 6], [3, 6, 7], //atas
      [0, 1, 5], [0, 5, 4], //bawah
    ];
    for (const f of baseFaces) this.faces.push(...f);

    // =====================================================
    // arch
    // =====================================================
    const startIndex = this.vertex.length / 6;

    // depan
    for (let i = 0; i <= archSegments; i++) {
      const theta = Math.PI * (i / archSegments);
      const x = Math.cos(theta) * archRadius;
      const y = Math.sin(theta) * archRadius + baseHeight;
      this.vertex.push(x, y, zFront, ...gray);
    }

    //belakang
    for (let i = 0; i <= archSegments; i++) {
      const theta = Math.PI * (i / archSegments);
      const x = Math.cos(theta) * archRadius;
      const y = Math.sin(theta) * archRadius + baseHeight;
      this.vertex.push(x, y, zBack, ...gray);
    }

    const frontArchStart = startIndex;
    const backArchStart = startIndex + archSegments + 1;

    // =====================================================
    // arch face
    // =====================================================

    // depan
    for (let i = 0; i < archSegments; i++) {
      const a = frontArchStart + i;
      const b = frontArchStart + i + 1;
      const baseLerpA = 7; //kiri atas dari box
      const baseLerpB = 6; //kanan atas dari box
      this.faces.push(baseLerpA, a, b);
      this.faces.push(baseLerpA, b, baseLerpB);
    }

    //belakang
    for (let i = 0; i < archSegments; i++) {
      const a = backArchStart + i;
      const b = backArchStart + i + 1;
      const baseLerpA = 3; // kiri atas dari box
      const baseLerpB = 2; // kanan atas dari box
      this.faces.push(baseLerpA, a, b);
      this.faces.push(baseLerpA, b, baseLerpB);
    }

    // side
    for (let i = 0; i < archSegments; i++) {
      const f1 = frontArchStart + i;
      const f2 = frontArchStart + i + 1;
      const b1 = backArchStart + i;
      const b2 = backArchStart + i + 1;

      this.faces.push(f1, b1, b2);
      this.faces.push(f1, b2, f2);
    }

    // =====================================================
    // arch to box
    // =====================================================
    const leftFront = frontArchStart + archSegments;
    const leftBack = backArchStart + archSegments;
    const rightFront = frontArchStart;
    const rightBack = backArchStart;

    // kiri
    this.faces.push(7, leftFront, leftBack);
    this.faces.push(7, leftBack, 3);

    // kanan
    this.faces.push(6, rightBack, rightFront);
    this.faces.push(6, 2, rightBack);
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

    this.childs.forEach((child) => child.render(this.MODEL_MATRIX));
  }
}
