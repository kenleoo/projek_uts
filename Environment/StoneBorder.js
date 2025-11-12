export class StoneBorder {
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

    a = 2, // base radius x
    b = 4, // base radius y
    c = 3, // height per stone (z)
    uSeg = 6,
    vSeg = 4
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    // === Build 3 vertically stacked ellipsoids (stones) ===
    const stoneCount = 3;
    const totalHeight = c * stoneCount * 1.1;

    for (let s = 0; s < stoneCount; s++) {
      // Vertical offset per stone
      const baseZ = -totalHeight / 2 + s * (c * 1.75);

      // Slightly randomize size and orientation
      const scaleX = a * (0.9 + Math.random() * 0.2);
      const scaleY = b * (0.9 + Math.random() * 0.2);
      const scaleZ = c * (0.9 + Math.random() * 0.2);

      const offsetX = (Math.random() - 0.5) * 0.3;
      const offsetY = (Math.random() - 0.5) * 0.3;

      for (let i = 0; i <= vSeg; i++) {
        let phi = Math.PI * i / vSeg;
        for (let j = 0; j <= uSeg; j++) {
          let theta = (2 * Math.PI * j) / uSeg;

          let x = scaleX * Math.sin(phi) * Math.cos(theta);
          let y = scaleY * Math.sin(phi) * Math.sin(theta);
          let z = scaleZ * Math.cos(phi);

          // Slight offset between stones
          x += offsetX;
          y += offsetY;
          z += baseZ;

          // Grayish stony color variation
          const gray = 0.3 + Math.sin(theta) * 0.25;
          const dirtR = gray;
          const dirtG = gray;
          const dirtB = gray;

          this.vertex.push(x, y, z);
          this.vertex.push(dirtR, dirtG, dirtB);
        }
      }
    }

    // === Faces ===
    const vertsPerStone = (vSeg + 1) * (uSeg + 1);

    for (let s = 0; s < stoneCount; s++) {
      const offset = s * vertsPerStone;
      for (let i = 0; i < vSeg; i++) {
        for (let j = 0; j < uSeg; j++) {
          const p1 = offset + i * (uSeg + 1) + j;
          const p2 = p1 + 1;
          const p3 = p1 + (uSeg + 1);
          const p4 = p3 + 1;

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
