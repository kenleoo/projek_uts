/*==============================================================
    GIANT CEMETERY DEAD TREE - NATURAL ASYMMETRY VERSION
==============================================================*/
export class DeadTree {
  GL = null;
  SHADER_PROGRAM = null;

  _position = null;
  _color = null;
  _MMatrix = null;

  vertex = [];
  faces = [];

  OBJECT_VERTEX = null;
  OBJECT_FACES = null;

  POSITION_MATRIX = LIBS.get_I4();
  MOVE_MATRIX = LIBS.get_I4();

  childs = [];

  constructor(
    GL,
    SHADER_PROGRAM,
    _position,
    _color,
    _MMatrix,
    trunkHeight = 16,
    trunkRadius = 2.3,
    branchLevels = 6,
    segments = 20
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _MMatrix;

    this.vertex = [];
    this.faces = [];

    // Build irregular trunk with gnarly randomness
    this._buildIrregularTrunk(trunkHeight, trunkRadius, segments);

    // Tier heights for branches (some randomness)
    const tiers = [
      trunkHeight * (0.9 - Math.random() * 0.1),
      trunkHeight * (0.75 - Math.random() * 0.1),
      trunkHeight * (0.6 - Math.random() * 0.1),
      trunkHeight * (0.45 - Math.random() * 0.1),
    ];

    // Branch count per tier (randomized around 3-5)
    tiers.forEach((y) => {
      const branchCount = 3 + Math.floor(Math.random() * 3); // 3 to 5 branches

      for (let i = 0; i < branchCount; i++) {
        // Random angle around trunk, not perfectly spaced
        const angle = (i / branchCount) * Math.PI * 2 + (Math.random() - 0.5) * (Math.PI / branchCount);

        // Branch length and radius with slight randomness
        const branchLength = trunkHeight * (0.3 + Math.random() * 0.2);
        const branchRadius = trunkRadius * (0.25 + Math.random() * 0.1);

        const branch = new DeadTreeBranch(
          GL,
          SHADER_PROGRAM,
          _position,
          _color,
          _MMatrix,
          y,
          branchRadius,
          branchLength,
          angle,
          0
        );

        this.childs.push(branch);
        branch.generateSubBranches(branchLevels - 1);
      }
    });
  }

  /*==============================================================
      Gnarly Irregular Trunk with subtle twists and radius noise
  ===============================================================*/
  _buildIrregularTrunk(height, radius, segments) {
    const steps = 7;
    const stepH = height / steps;

    for (let s = 0; s < steps; s++) {
      const y0 = s * stepH;
      const y1 = (s + 1) * stepH;

      // Decrease radius gradually + random noise
      let r0 = radius * (1 - s * 0.13) * (0.85 + Math.random() * 0.3);
      let r1 = radius * (1 - (s + 1) * 0.13) * (0.85 + Math.random() * 0.3);

      this._buildCylinder(y0, stepH, r0, r1, segments);
    }
  }

  /*==============================================================*/
  _buildCylinder(yStart, height, rBottom, rTop, segments, scaleColor = 1) {
    const baseIndex = this.vertex.length / 6;

    for (let i = 0; i <= 1; i++) {
      const t = i;
      const r = rBottom + (rTop - rBottom) * t;
      const y = yStart + height * t;

      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        // Add a slight "twist" to trunk vertices
        const twistAmount = (yStart / height) * 0.3; // twist increases upwards
        const twistedTheta = theta + twistAmount;

        const x = Math.cos(twistedTheta) * r;
        const z = Math.sin(twistedTheta) * r;

        // Dark dead tree brown, with slight color variation per vertex
        const baseCol = [0.20, 0.18, 0.15];
        const colorNoise = 0.02 * (Math.random() - 0.5);
        const col = baseCol.map(c => Math.min(Math.max(c + colorNoise, 0), 1));

        this.vertex.push(x, y, z, ...col);
      }
    }

    for (let j = 0; j < segments; j++) {
      const p1 = baseIndex + j;
      const p2 = baseIndex + j + segments + 1;
      const p3 = p2 + 1;
      const p4 = p1 + 1;

      this.faces.push(p1, p2, p3);
      this.faces.push(p1, p3, p4);
    }
  }

  setup() {
    this.OBJECT_VERTEX = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(this.vertex), this.GL.STATIC_DRAW);

    this.OBJECT_FACES = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), this.GL.STATIC_DRAW);

    this.childs.forEach(child => child.setup());
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

    this.childs.forEach(child => child.render(this.MODEL_MATRIX));
  }
}

/*============================================================================
    DEAD TREE BRANCH - WITH ASYMMETRIC TWISTS & SAG
============================================================================*/
class DeadTreeBranch {
  constructor(GL, SHADER_PROGRAM, pos, col, mat, yStart, radius, height, angle, tilt) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = pos;
    this._color = col;
    this._MMatrix = mat;

    this.vertex = [];
    this.faces = [];
    this.childs = [];

    this.radius = radius;
    this.height = height;

    this.POSITION_MATRIX = LIBS.get_I4();
    this.MOVE_MATRIX = LIBS.get_I4();

    // Rotate branch around trunk by base angle + small random offset
    LIBS.rotateY(this.MOVE_MATRIX, angle + (Math.random() - 0.5) * 0.2);

    // Tilt branch downward by base tilt + small random offset
    LIBS.rotateX(this.MOVE_MATRIX, -(tilt + (Math.random() - 0.5) * 0.2));

    // Random sag rotation around branch's forward axis (Z)
    LIBS.rotateZ(this.MOVE_MATRIX, (Math.random() - 0.5) * (Math.PI / 10));

    // Slight random twist to add natural variation in Y rotation
    LIBS.rotateY(this.MOVE_MATRIX, (Math.random() - 0.5) * 0.4);

    LIBS.translateY(this.MOVE_MATRIX, yStart);

    this._buildCylinder(0, height, radius, radius * (0.65 + Math.random() * 0.1), 14);
  }

  _buildCylinder(yStart, height, rBottom, rTop, segments) {
    const baseIndex = this.vertex.length / 6;

    for (let i = 0; i <= 1; i++) {
      const r = rBottom + (rTop - rBottom) * i;
      const y = yStart + height * i;

      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;

        // Add slight twist to branches for natural feel
        const twistAmount = (yStart / height) * 0.4;
        const twistedTheta = theta + twistAmount * i;

        const x = Math.cos(twistedTheta) * r;
        const z = Math.sin(twistedTheta) * r;

        // Dead wood color with slight noise
        const baseCol = [0.20, 0.18, 0.15];
        const colorNoise = 0.03 * (Math.random() - 0.5);
        const col = baseCol.map(c => Math.min(Math.max(c + colorNoise, 0), 1));

        this.vertex.push(x, y, z, ...col);
      }
    }

    for (let j = 0; j < segments; j++) {
      const p1 = baseIndex + j;
      const p2 = baseIndex + j + segments + 1;
      const p3 = p2 + 1;
      const p4 = p1 + 1;

      this.faces.push(p1, p2, p3);
      this.faces.push(p1, p3, p4);
    }
  }

  /*==============================================================
      ASYMMETRIC V-SHAPED BRANCH SPLITTING with random angles and tilt
  ================================================================*/
  generateSubBranches(level) {
    if (level <= 0 || this.radius < 0.07) return;

    // Random wide spread angle, around ~70° ± 30°
    const baseAngleSpread = (Math.PI / 2.6) + (Math.random() - 0.5) * (Math.PI / 3);
    const downwardTiltBase = (Math.PI / 6) + (Math.random() - 0.5) * (Math.PI / 8);
    const sagTilt = (Math.random() - 0.5) * (Math.PI / 12);

    const offsets = [-baseAngleSpread, baseAngleSpread];

    offsets.forEach(offset => {
      const b = new DeadTreeBranch(
        this.GL,
        this.SHADER_PROGRAM,
        this._position,
        this._color,
        this._MMatrix,

        this.height * (0.7 + Math.random() * 0.15),
        this.radius * (0.65 + Math.random() * 0.1),
        this.height * (0.55 + Math.random() * 0.2),

        offset,
        downwardTiltBase
      );

      LIBS.rotateZ(b.MOVE_MATRIX, sagTilt);

      this.childs.push(b);
      b.generateSubBranches(level - 1);
    });
  }

  setup() {
    this.OBJECT_VERTEX = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(this.vertex), this.GL.STATIC_DRAW);

    this.OBJECT_FACES = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), this.GL.STATIC_DRAW);

    this.childs.forEach(child => child.setup());
  }

  render(PARENT_MATRIX) {
    let MODEL_MATRIX = LIBS.multiply(this.MOVE_MATRIX, this.POSITION_MATRIX);
    MODEL_MATRIX = LIBS.multiply(MODEL_MATRIX, PARENT_MATRIX);

    this.GL.useProgram(this.SHADER_PROGRAM);
    this.GL.uniformMatrix4fv(this._MMatrix, false, MODEL_MATRIX);

    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    this.GL.vertexAttribPointer(this._position, 3, this.GL.FLOAT, false, 24, 0);
    this.GL.vertexAttribPointer(this._color, 3, this.GL.FLOAT, false, 24, 12);

    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    this.GL.drawElements(this.GL.TRIANGLES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);

    this.childs.forEach(child => child.render(MODEL_MATRIX));
  }
}
