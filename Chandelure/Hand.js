export class Hand {
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
    stacks = 60,
    circleSegments = 14,
    radius = 5,
    height = 10
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    /*========================= Spiral Path =========================*/

    function generateCurvedSpiralPath(turns, points, startRadius, endRadius, curvePower = 2.5) {
      const path = [];
      const radiusDiff = startRadius - endRadius;

      for (let i = 0; i <= points; i++) {
        const t = i / points;
        const r = startRadius - radiusDiff * Math.pow(t, curvePower);
        const theta = Math.pow(t, 0.7) * turns * 2 * Math.PI;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        const z = 0;
        path.push([x, y, z]);
      }

      return path;
    }

    // Tube generator
    function generateTubeAlongPath(path, circleSegments = 24, tubeRadius = 0.25) {
      const vertices = [];
      const faces = [];

      for (let i = 0; i < path.length; i++) {
        const [x, y, z] = path[i];
        const forward =
          i < path.length - 1
            ? LIBS.normalize(LIBS.subtract(path[i + 1], path[i]))
            : LIBS.normalize(LIBS.subtract(path[i], path[i - 1]));

        const up = [0, 0, 1];
        let side = LIBS.cross(forward, up);
        if (Math.hypot(side[0], side[1], side[2]) < 0.001) side = [1, 0, 0];
        side = LIBS.normalize(side);
        const localUp = LIBS.cross(side, forward);

        const taper = 1 - i / path.length;
        const currentRadius = tubeRadius * (0.3 + 0.7 * taper);

        for (let j = 0; j < circleSegments; j++) {
          const theta = (j / circleSegments) * 2 * Math.PI;
          const cx = Math.cos(theta) * currentRadius;
          const cy = Math.sin(theta) * currentRadius;

          const vx = x + side[0] * cx + localUp[0] * cy;
          const vy = y + side[1] * cx + localUp[1] * cy;
          const vz = z + side[2] * cx + localUp[2] * cy;

          vertices.push(vx, vy, vz, 0.1, 0.1, 0.1);
        }
      }

      for (let i = 0; i < path.length - 1; i++) {
        for (let j = 0; j < circleSegments; j++) {
          const next = (j + 1) % circleSegments;
          const current = i * circleSegments + j;
          const nextRing = (i + 1) * circleSegments + j;
          const nextRingNext = (i + 1) * circleSegments + next;
          const currentNext = i * circleSegments + next;

          faces.push(current, nextRing, currentNext);
          faces.push(nextRing, nextRingNext, currentNext);
        }
      }

      return { vertices, faces };
    }

    // Base spiral
    const basePath = generateCurvedSpiralPath(
      1.5, // turns
      300, // points
      radius,
      radius * 0.05,
      0.5
    );

    // === Proper curved extension ("the other end") ===
    const first = basePath[0];
    const second = basePath[1];

    // tangent direction (outwards)
    const dir = LIBS.normalize(LIBS.subtract(first, second));
    const normal = [0, 0, 1];
    const side = LIBS.cross(normal, dir);

    const extension = [];
    const extCount = 40;
    const extStep = 1;

    let prevPoint = first;
    for (let i = 1; i <= extCount; i++) {
      const t = i / extCount;
      // curve gently outward with rotation
      const bendAngle = t * Math.PI * 0.6; // 108 degrees
      const offset = [
        dir[0] * Math.cos(bendAngle) - side[0] * Math.sin(bendAngle),
        dir[1] * Math.cos(bendAngle) - side[1] * Math.sin(bendAngle),
        dir[2],
      ];
      const next = [
        prevPoint[0] + offset[0] * extStep,
        prevPoint[1] + offset[1] * extStep,
        prevPoint[2] + offset[2] * extStep * 0.2, // gentle rise
      ];
      extension.unshift(next); // prepend (so it's before the spiral)
      prevPoint = next;
    }

    const fullPath = [...extension, ...basePath];

    const tube = generateTubeAlongPath(fullPath, circleSegments, radius * 0.18);

    this.vertex = tube.vertices;
    this.faces = tube.faces;
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
    // this.GL.drawElements(this.GL.TRIANGLES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);
    this.GL.drawElements(this.GL.LINES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);

    this.childs.forEach((child) => child.render(this.MODEL_MATRIX));
  }
}
