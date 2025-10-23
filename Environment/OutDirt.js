export class OutwardDirt {
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

    a = 0.7, // radius x
    b = 0.4, // radius y
    c = 0.4,  // height (z)
    uSeg = 90,  // around
    vSeg = 45,  // vertical
    roughness = 0.08 // how bumpy (0.0 - 0.2 recommended)
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    // Simple pseudo-random function for repeatable bumps
    const rand = (x, y) => {
      return (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
    };

    /*==================== Uneven dirt mound ====================*/
    for (let i = 0; i <= vSeg; i++) {
      let phi = Math.PI * i / vSeg; // 0 (top) → π (bottom)
      for (let j = 0; j <= uSeg; j++) {
        let theta = (2 * Math.PI * j) / uSeg;

        // Base ellipsoid
        let x = a * Math.sin(phi) * Math.cos(theta);
        let y = b * Math.sin(phi) * Math.sin(theta);
        let z = c * Math.cos(phi);

        // Generate bump noise
        const noise =
          (rand(i, j) - 0.5) * 2 + // pseudo-random (-1 to 1)
          Math.sin(i * 0.4 + j * 0.3) * 0.2; // wavy component

        // Apply uneven displacement (z and small xy jitter)
        const bump = noise * roughness;
        z += bump * 0.5; // main uneven height
        x += bump * 0.2 * Math.cos(theta);
        y += bump * 0.2 * Math.sin(theta);

        // Make edges (bottom ring) a little lower (blend with ground)
        if (i === vSeg) z -= 0.05 + Math.random() * 0.02;

        // Slight brownish color variation
        const dirtR = 0.3 + Math.random() * 0.1;
        const dirtG = 0.2 + Math.random() * 0.1;
        const dirtB = 0.1 + Math.random() * 0.05;

        this.vertex.push(x, y, z);
        this.vertex.push(dirtR, dirtG, dirtB);
      }
    }

    // Faces (triangles between rings)
    for (let i = 0; i < vSeg; i++) {
      for (let j = 0; j < uSeg; j++) {
        let p1 = i * (uSeg + 1) + j;
        let p2 = p1 + 1;
        let p3 = p1 + (uSeg + 1);
        let p4 = p3 + 1;

        this.faces.push(p1, p3, p4);
        this.faces.push(p1, p4, p2);
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

    this.childs.forEach((child) => child.render(this.MODEL_MATRIX));
  }
}
