export class NonSymmetricalBoxGrave {
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
    _MMatrix,
    baseWidth = 2,
    baseDepth = 1,
    baseHeight = 1.2,
    topWidth = 1.4,
    topDepth = 0.8,
    topHeight = 2.5,
    tilt = 0.2 // front is lower, back is higher
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _MMatrix;

    const gray = [0.28, 0.28, 0.28];

    // ================================================================
    // Helper for pushing 8 vertices of a box
    // ================================================================
    const pushBox = (cx, cy, cz, w, h, d) => {
      let hw = w / 2,
          hh = h / 2,
          hd = d / 2;

      const start = this.vertex.length / 6;

      const verts = [
        // Back
        [cx - hw, cy - hh, cz - hd, ...gray],
        [cx + hw, cy - hh, cz - hd, ...gray],
        [cx + hw, cy + hh, cz - hd, ...gray],
        [cx - hw, cy + hh, cz - hd, ...gray],
        // Front
        [cx - hw, cy - hh, cz + hd, ...gray],
        [cx + hw, cy - hh, cz + hd, ...gray],
        [cx + hw, cy + hh, cz + hd, ...gray],
        [cx - hw, cy + hh, cz + hd, ...gray],
      ];

      this.vertex.push(...verts.flat());

      const faces = [
        [0, 1, 2], [0, 2, 3], // back
        [4, 5, 6], [4, 6, 7], // front
        [0, 4, 7], [0, 7, 3], // left
        [1, 5, 6], [1, 6, 2], // right
        [3, 2, 6], [3, 6, 7], // top
        [0, 1, 5], [0, 5, 4], // bottom
      ];
      
      faces.forEach(f =>
        this.faces.push(start + f[0], start + f[1], start + f[2])
      );
    };

    // ================================================================
    // Base block (simple box)
    // ================================================================
    pushBox(0, baseHeight / 2, 0, baseWidth, baseHeight, baseDepth);

    // ================================================================
    // Top block (asymmetrical & tilted)
    // ================================================================

    // The top box is not symmetrical:
    // - narrower
    // - shorter depth
    // - shifted
    // - tilted forward/back
    //
    // Instead of making a perfect box, we modify the top vertices manually.

    const startIndex = this.vertex.length / 6;

    const topY = baseHeight + topHeight / 2;

    const hw = topWidth / 2;
    const hd = topDepth / 2;
    const hh = topHeight / 2;

    // FRONT is slightly lower (tilt)
    const frontTilt = -tilt;
    const backTilt = tilt;

    const topVerts = [
      // Back (higher due to tilt)
      [-hw, topY - hh + backTilt, -hd, ...gray],
      [ hw, topY - hh + backTilt, -hd, ...gray],
      [ hw, topY + hh + backTilt, -hd, ...gray],
      [-hw, topY + hh + backTilt, -hd, ...gray],

      // Front (lower)
      [-hw, topY - hh + frontTilt,  hd, ...gray],
      [ hw, topY - hh + frontTilt,  hd, ...gray],
      [ hw, topY + hh + frontTilt,  hd, ...gray],
      [-hw, topY + hh + frontTilt,  hd, ...gray],
    ];

    this.vertex.push(...topVerts.flat());

    const f = [
      [0,1,2],[0,2,3],
      [4,5,6],[4,6,7],
      [0,4,7],[0,7,3],
      [1,5,6],[1,6,2],
      [3,2,6],[3,6,7],
      [0,1,5],[0,5,4],
    ];
    for (let i of f) {
      this.faces.push(startIndex + i[0], startIndex + i[1], startIndex + i[2]);
    }
  }

  setup() {
    this.OBJECT_VERTEX = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(this.vertex), this.GL.STATIC_DRAW);

    this.OBJECT_FACES = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), this.GL.STATIC_DRAW);

    this.childs.forEach(c => c.setup());
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

    this.childs.forEach(c => c.render(this.MODEL_MATRIX));
  }
}
