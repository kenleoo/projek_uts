export class Pumpkin {
  GL = null;
  SHADER_PROGRAM = null;

  _position = null;
  _color = null;
  _MMatrix = null;

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

    // Pumpkin params
    radX = 0.7,
    radY = 0.7,
    radZ = 0.55,
    uSeg = 120,
    vSeg = 60,

    // Ribs
    ribStrength = 0.025,
    ribFrequency = 6,
    ribDarken = 0.45,

    // Stem
    stemBase = 0.10,
    stemTop = 0.05,
    stemHeight = 0.20,
    stemSeg = 60
  ) {

    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    /* ========================================================================
       🎃 MAIN PUMPKIN BODY WITH DARK RIBS + CLEAN FACE
    ======================================================================== */
    for (let i = 0; i <= vSeg; i++) {
      let v = i / vSeg;
      let phi = Math.PI * v;

      for (let j = 0; j <= uSeg; j++) {
        let u = j / uSeg;
        let theta = u * Math.PI * 2;

        /* --------------------------------------------------------------------
           🟣 STRONGER RIB BULGE + DARKER RIB SHADING
        -------------------------------------------------------------------- */
        let ribWave = Math.sin(theta * ribFrequency);
        let rib = 1 + ribStrength * Math.pow(Math.abs(ribWave), 1.6) * Math.sign(ribWave);

        let x = radX * rib * Math.sin(phi) * Math.cos(theta);
        let y = radY * rib * Math.sin(phi) * Math.sin(theta);
        let z = radZ * Math.cos(phi);

        /* --------------------------------------------------------------------
           🎨 ORANGE GRADIENT
        -------------------------------------------------------------------- */
        let cTop = [1.0, 0.60, 0.0];
        let cBot = [0.55, 0.22, 0.0];
        let t = v;

        let r = cBot[0] * (1 - t) + cTop[0] * t;
        let g = cBot[1] * (1 - t) + cTop[1] * t;
        let b = cBot[2] * (1 - t) + cTop[2] * t;

        /* --------------------------------------------------------------------
           🟤 DEEP RIB SHADOW
        -------------------------------------------------------------------- */
        let ribShadow = Math.abs(ribWave);
        let shadowFactor = 1.0 - (ribDarken * 0.15) * Math.pow(ribShadow, 1.2);
        shadowFactor = Math.max(0.125, shadowFactor); // prevent too dark

        r *= shadowFactor;
        g *= shadowFactor;
        b *= shadowFactor;

        /* --------------------------------------------------------------------
           🎃 IMPROVED HALLOWEEN FACE (sharp triangles + curved mouth)
        -------------------------------------------------------------------- */
        let angH = Math.atan2(y, x);
        let angV = Math.acos(z / radZ);

        const eyeV = 0.44 * Math.PI;
        const eyeWidth = 0.28;
        const eyeHeight = 0.12;

        // Triangular-ish eye masks
        let leftEye =
          Math.abs(angH + 0.75) < eyeWidth &&
          Math.abs(angV - eyeV) < eyeHeight &&
          (angH + 0.75) < (angV - eyeV) * 2.2;

        let rightEye =
          Math.abs(angH - 0.75) < eyeWidth &&
          Math.abs(angV - eyeV) < eyeHeight &&
          (angH - 0.75) > -(angV - eyeV) * 2.2;

        // Nose (clean centered triangle)
        let nose =
          Math.abs(angH) < 0.14 &&
          angV > eyeV + 0.10 &&
          angV < eyeV + 0.26;

        // Curved mouth
        let mouthBand = angV > eyeV + 0.32 && angV < eyeV + 0.62;
        let mouthCurve = Math.cos((angH / 1.2) * Math.PI);
        let mouth = mouthBand && mouthCurve > -0.15;

        /* --------------------------------------------------------------------
           ⭐ YELLOW FACE GLOW (FRONT SIDE ONLY)
           Fixes the "yellow on back" issue.
        -------------------------------------------------------------------- */
        if ((leftEye || rightEye || nose || mouth) && x > 0) {
          r *= 2;
          g *= 4;
          b *= 1;
        }

        // Store vertex
        this.vertex.push(x, y, z, r, g, b);
      }
    }

    /* ========================================================================
       🔺 BODY INDICES
    ======================================================================== */
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

    /* ========================================================================
       🌱 STEM
    ======================================================================== */
    const stemStart = this.vertex.length / 6;
    const baseZ = radZ;
    const topZ = radZ + stemHeight;

    for (let i = 0; i <= stemSeg; i++) {
      let t = i / stemSeg;
      let z = baseZ + t * stemHeight;

      let radius = stemBase * (1 - t) + stemTop * t;
      let bendX = 0.03 * Math.sin(t * Math.PI);
      let bendY = 0.03 * Math.sin(t * Math.PI * 1.3);

      for (let j = 0; j <= stemSeg; j++) {
        let theta = (j / stemSeg) * Math.PI * 2;

        let x = radius * Math.cos(theta) + bendX;
        let y = radius * Math.sin(theta) + bendY;

        let r = 0.15 + 0.1 * t;
        let g = 0.35 + 0.2 * t;
        let b = 0.15;

        this.vertex.push(x, y, z, r, g, b);
      }
    }

    const ringCount = stemSeg + 1;

    for (let i = 0; i < stemSeg; i++) {
      for (let j = 0; j < stemSeg; j++) {
        let p1 = stemStart + i * ringCount + j;
        let p2 = p1 + 1;
        let p3 = p1 + ringCount;
        let p4 = p3 + 1;

        this.faces.push(p1, p2, p4);
        this.faces.push(p1, p4, p3);
      }
    }
  }

  /* ========================================================================
     🔧 BUFFERS + RENDERING
    ======================================================================== */
  setup() {
    this.OBJECT_VERTEX = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    this.GL.bufferData(
      this.GL.ARRAY_BUFFER,
      new Float32Array(this.vertex),
      this.GL.STATIC_DRAW
    );

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
    this.GL.drawElements(
      this.GL.TRIANGLES,
      this.faces.length,
      this.GL.UNSIGNED_SHORT,
      0
    );

    this.childs.forEach((child) => child.render(this.MODEL_MATRIX));
  }
}
