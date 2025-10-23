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
    const baseHeight = height - archRadius; // flat rectangular section
    const zFront = depth / 2;
    const zBack = -depth / 2;

    // =====================================================
    // 1️⃣ Base Rectangle (Box)
    // =====================================================
    const baseVertices = [
      // x, y, z, r, g, b
      [-width / 2, 0, zBack, ...gray], // 0 back-bottom-left
      [width / 2, 0, zBack, ...gray],  // 1 back-bottom-right
      [width / 2, baseHeight, zBack, ...gray], // 2 back-top-right
      [-width / 2, baseHeight, zBack, ...gray], // 3 back-top-left

      [-width / 2, 0, zFront, ...gray], // 4 front-bottom-left
      [width / 2, 0, zFront, ...gray],  // 5 front-bottom-right
      [width / 2, baseHeight, zFront, ...gray], // 6 front-top-right
      [-width / 2, baseHeight, zFront, ...gray], // 7 front-top-left
    ];

    this.vertex.push(...baseVertices.flat());

    // Faces (rectangular box)
    const baseFaces = [
      [0, 1, 2], [0, 2, 3], // back
      [4, 5, 6], [4, 6, 7], // front
      [0, 4, 7], [0, 7, 3], // left
      [1, 5, 6], [1, 6, 2], // right
      [3, 2, 6], [3, 6, 7], // top of base (connect to arch bottom)
      [0, 1, 5], [0, 5, 4], // bottom
    ];
    for (const f of baseFaces) this.faces.push(...f);

    // =====================================================
    // 2️⃣ Arched Top (from GraveArch logic)
    // =====================================================
    const startIndex = this.vertex.length / 6;

    // Front arch
    for (let i = 0; i <= archSegments; i++) {
      const theta = Math.PI * (i / archSegments);
      const x = Math.cos(theta) * archRadius;
      const y = Math.sin(theta) * archRadius + baseHeight;
      this.vertex.push(x, y, zFront, ...gray);
    }

    // Back arch
    for (let i = 0; i <= archSegments; i++) {
      const theta = Math.PI * (i / archSegments);
      const x = Math.cos(theta) * archRadius;
      const y = Math.sin(theta) * archRadius + baseHeight;
      this.vertex.push(x, y, zBack, ...gray);
    }

    const frontArchStart = startIndex;
    const backArchStart = startIndex + archSegments + 1;

    // =====================================================
    // 3️⃣ Arch Faces
    // =====================================================

    // Front face (fan between base top and arch curve)
    for (let i = 0; i < archSegments; i++) {
      const a = frontArchStart + i;
      const b = frontArchStart + i + 1;
      const baseLerpA = 7; // base top left (front)
      const baseLerpB = 6; // base top right (front)
      this.faces.push(baseLerpA, a, b);
      this.faces.push(baseLerpA, b, baseLerpB);
    }

    // Back face (reverse winding)
    for (let i = 0; i < archSegments; i++) {
      const a = backArchStart + i;
      const b = backArchStart + i + 1;
      const baseLerpA = 3; // base top left (back)
      const baseLerpB = 2; // base top right (back)
      this.faces.push(baseLerpA, b, a);
      this.faces.push(baseLerpA, baseLerpB, b);
    }

    // Connect front and back arch sides (side wall of arch)
    for (let i = 0; i < archSegments; i++) {
      const f1 = frontArchStart + i;
      const f2 = frontArchStart + i + 1;
      const b1 = backArchStart + i;
      const b2 = backArchStart + i + 1;

      this.faces.push(f1, b1, b2);
      this.faces.push(f1, b2, f2);
    }

    // =====================================================
    // 4️⃣ Connect Arch Base to Box Top
    // =====================================================
    // Left and right wall closures
    const leftFront = frontArchStart + archSegments;
    const leftBack = backArchStart + archSegments;
    const rightFront = frontArchStart;
    const rightBack = backArchStart;

    // Left side wall
    this.faces.push(7, leftFront, leftBack);
    this.faces.push(7, leftBack, 3);

    // Right side wall
    this.faces.push(6, rightBack, rightFront);
    this.faces.push(6, 2, rightBack);
  }

  // =====================================================
  // Setup / Render (same as before)
  // =====================================================
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
