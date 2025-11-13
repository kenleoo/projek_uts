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
    width = 80,
    height = 2,
    depth = 80,
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    const halfW = width / 2;
    const halfH = height / 2;
    const halfD = depth / 2;
    const uSeg = 180;
    const vSeg = 180;

    // Terrain shaping constants
    const slopeHeight = height * 2.0 + 2; // how tall the front is compared to back
    var temp = 0;

// --- Top face (grass forming stepped downhill slope with smooth dirt transition)
for (let i = 0; i <= vSeg; i++) {
  let z = -halfD + (i / vSeg) * depth;
  let zRatio = (z + halfD) / depth;
  for (let j = 0; j <= uSeg; j++) {
    let x = -halfW + (j / uSeg) * width;
    let slope = (1 - zRatio) * slopeHeight;

    // Section settings
    const sectionSize = 50;  // width of each flat section
    const smoothZone = 10;    // blending zone rows

    // Figure out section and blend range
    const sectionStart = Math.floor(i / sectionSize) * sectionSize;
    const sectionEnd = sectionStart + sectionSize;
    const blendStart = sectionStart + (sectionSize - smoothZone);

    // Base height
    const baseHeight = halfH + slope;

    // Track slope zone for blending
    if (i % sectionSize === 0) temp = baseHeight;
    let smoothHeight = baseHeight;
    let isSlopeZone = false;
    let t = 0;

    if (i >= blendStart && i < sectionEnd && i > 0) {
      t = (i - blendStart) / smoothZone; // 0→1
      const eased = t * t * (3 - 2 * t);
      smoothHeight = temp * (1 - eased) + baseHeight * eased;
      isSlopeZone = true;
    } else if (i < blendStart) {
      smoothHeight = temp;
    }

    // --- Color logic ---
    let colorGrassFront = [0.0, 0.1, 0.2];
    let colorGrassBack  = [0.0, 0.1, 0.2];
    let colorDirt       = [0.25, 0.15, 0.05]; // brown dirt tone

    // Base grass gradient (front → back)
    let tColor = i / vSeg;
    let r = colorGrassFront[0] * (1 - tColor) + colorGrassBack[0] * tColor;
    let g = colorGrassFront[1] * (1 - tColor) + colorGrassBack[1] * tColor;
    let b = colorGrassFront[2] * (1 - tColor) + colorGrassBack[2] * tColor;

    // Gradual brown tint through slope zone
    if (isSlopeZone) {
      const dirtBlend = 0.1 + 0.9 * t; // starts slightly brown → full brown near middle
      r = r * (1 - dirtBlend) + colorDirt[0] * dirtBlend;
      g = g * (1 - dirtBlend) + colorDirt[1] * dirtBlend;
      b = b * (1 - dirtBlend) + colorDirt[2] * dirtBlend;
    }

    this.vertex.push(x, smoothHeight, z);
    this.vertex.push(r, g, b);
  }
}






    // --- Bottom face (flat dirt base)
    for (let i = 0; i <= vSeg; i++) {
      let z = -halfD + (i / vSeg) * depth;
      for (let j = 0; j <= uSeg; j++) {
        let x = -halfW + (j / uSeg) * width;
        this.vertex.push(x, -halfH, z);
        this.vertex.push(0.35, 0.16, 0.05);
      }
    }

    // --- Faces (triangles)
    // Top
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

    // Bottom
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

 // --- Sides between grass and dirt (4 walls) ---
const topOffset = 0;
const bottomOffset = (vSeg + 1) * (uSeg + 1);

// FRONT side (z = -halfD)
for (let j = 0; j < uSeg; j++) {
  let topP1 = topOffset + j;
  let topP2 = topOffset + j + 1;
  let bottomP1 = bottomOffset + j;
  let bottomP2 = bottomOffset + j + 1;
  this.faces.push(topP1, bottomP1, topP2);
  this.faces.push(topP2, bottomP1, bottomP2);
}

// BACK side (z = +halfD)
for (let j = 0; j < uSeg; j++) {
  let topP1 = vSeg * (uSeg + 1) + j;
  let topP2 = topP1 + 1;
  let bottomP1 = bottomOffset + vSeg * (uSeg + 1) + j;
  let bottomP2 = bottomP1 + 1;
  this.faces.push(topP1, topP2, bottomP1);
  this.faces.push(topP2, bottomP2, bottomP1);
}

// LEFT side (x = -halfW)
for (let i = 0; i < vSeg; i++) {
  let topP1 = i * (uSeg + 1);
  let topP2 = topP1 + (uSeg + 1);
  let bottomP1 = bottomOffset + i * (uSeg + 1);
  let bottomP2 = bottomP1 + (uSeg + 1);
  this.faces.push(topP1, bottomP1, topP2);
  this.faces.push(topP2, bottomP1, bottomP2);
}

// RIGHT side (x = +halfW)
for (let i = 0; i < vSeg; i++) {
  let topP1 = i * (uSeg + 1) + uSeg;
  let topP2 = topP1 + (uSeg + 1);
  let bottomP1 = bottomOffset + i * (uSeg + 1) + uSeg;
  let bottomP2 = bottomP1 + (uSeg + 1);
  this.faces.push(topP1, topP2, bottomP1);
  this.faces.push(topP2, bottomP2, bottomP1);
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
