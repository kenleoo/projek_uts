export class GraveArch {
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

  constructor(GL, SHADER_PROGRAM, _position, _color, _Mmatrix) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    const gateHeight = 15;
    const postWidth = 0.5;
    const postDepth = 0.5;
    const gateWidth = 20;
    const barSpacing = 1;
    const barThickness = 5;
    const barHeight = 0;

    let vertexOffset = 0;

    // === Helper: Add a box ===
    const addBox = (x, y, z, w, h, d, r = 0.1, g = 0.1, b = 0.1) => {
      const hw = w / 2;
      const hh = h / 2;
      const hd = d / 2;

      const verts = [
        x - hw, y - hh, z - hd, r, g, b,
        x + hw, y - hh, z - hd, r, g, b,
        x + hw, y + hh, z - hd, r, g, b,
        x - hw, y + hh, z - hd, r, g, b,
        x - hw, y - hh, z + hd, r, g, b,
        x + hw, y - hh, z + hd, r, g, b,
        x + hw, y + hh, z + hd, r, g, b,
        x - hw, y + hh, z + hd, r, g, b,
      ];

      const indices = [
        0, 1, 2, 0, 2, 3,
        1, 5, 6, 1, 6, 2,
        5, 4, 7, 5, 7, 6,
        4, 0, 3, 4, 3, 7,
        3, 2, 6, 3, 6, 7,
        4, 5, 1, 4, 1, 0,
      ].map(i => i + vertexOffset);

      this.vertex.push(...verts);
      this.faces.push(...indices);

      vertexOffset += 8;
    };

    // === Add pillars ===
    addBox(-gateWidth / 2, gateHeight / 2, 0, postWidth, gateHeight, postDepth);
    addBox(gateWidth / 2, gateHeight / 2, 0, postWidth, gateHeight, postDepth);

    // === Add Arch ===
    const archRadius = gateWidth / 2;
    const archSegments = 60;
    const archThickness = 1.8;
    const archY = gateHeight;

    const archVerts = [];
    for (let i = 0; i <= archSegments; i++) {
      const theta = Math.PI * (i / archSegments);
      const x = archRadius * Math.cos(theta);
      const y = archY + archRadius * Math.sin(theta);
      const z = 0;
      archVerts.push(x, y, z, 0.1, 0.1, 0.1);
      archVerts.push(x, y - archThickness, z, 0.1, 0.1, 0.1);
    }

    const archStartIndex = vertexOffset;
    this.vertex.push(...archVerts);
    for (let i = 0; i < archSegments * 2; i += 2) {
      this.faces.push(
        archStartIndex + i,
        archStartIndex + i + 1,
        archStartIndex + i + 3,
        archStartIndex + i,
        archStartIndex + i + 3,
        archStartIndex + i + 2
      );
    }

    vertexOffset += (archSegments + 1) * 2;

    // === Add vertical bars ===
    const barCount = Math.floor(gateWidth / barSpacing);
    for (let i = 0; i <= barCount; i++) {
      const x = -gateWidth / 2 + i * barSpacing;
      addBox(x, barHeight / 2, 0, barThickness, barHeight, barThickness);
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

    this.childs.forEach((child) => child.render(this.MODEL_MATRIX));
  }
}
