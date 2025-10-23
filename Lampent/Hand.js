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
    segments = 60,
    radius = 10,
    startCurveAngle = 0.5,
    endCurveAngle = 0.5
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _Mmatrix;

    this.vertex = [];
    this.faces = [];

    /*========================= Curved Ribbon/Blade Path =========================*/

    function generateCurvedPath(points, length, startAngle, endAngle) {
      const path = [];
      
      for (let i = 0; i <= points; i++) {
        const t = i / points;
        
        // Interpolate between start and end curve angles
        // Use power function to control acceleration
        const curveIntensity = startAngle + Math.pow(t, 2) * (endAngle - startAngle);
        const angle = t * curveIntensity * Math.PI * 0.5;
        const distance = t * length;
        
        const x = Math.sin(angle) * distance;
        const y = -Math.cos(angle) * distance;
        const z = 0;
        
        path.push([x, y, z]);
      }

      return path;
    }

    // Flat ribbon generator (rectangular cross-section, not tube)
    function generateFlatRibbon(path, width = 1.5, thickness = 0.5) {
      const vertices = [];
      const faces = [];

      for (let i = 0; i < path.length; i++) {
        const [x, y, z] = path[i];
        
        // Calculate tangent direction
        const forward =
          i < path.length - 1
            ? LIBS.normalize(LIBS.subtract(path[i + 1], path[i]))
            : LIBS.normalize(LIBS.subtract(path[i], path[i - 1]));

        // Calculate perpendicular directions for flat ribbon
        const up = [0, 0, 1]; // Z-axis is "up" (thickness direction)
        let side = LIBS.cross(forward, up);
        if (Math.hypot(side[0], side[1], side[2]) < 0.001) side = [1, 0, 0];
        side = LIBS.normalize(side);

        // REVERSED taper: smaller at start (0.2), larger at end (1.0)
        const taper = 0.2 + (i / path.length) * 0.8; // Start at 20%, grow to 100%
        const currentWidth = width * taper;
        const currentThickness = thickness * taper;

        // Create 4 corners of rectangular cross-section
        const halfWidth = currentWidth / 2;
        const halfThickness = currentThickness / 2;

        // Top-left, top-right, bottom-left, bottom-right
        const corners = [
          [-halfWidth, halfThickness],   // top-left
          [halfWidth, halfThickness],    // top-right
          [-halfWidth, -halfThickness],  // bottom-left
          [halfWidth, -halfThickness],   // bottom-right
        ];

        for (let c = 0; c < corners.length; c++) {
          const [s, u] = corners[c];
          
          const vx = x + side[0] * s + up[0] * u;
          const vy = y + side[1] * s + up[1] * u;
          const vz = z + side[2] * s + up[2] * u;

          vertices.push(vx, vy, vz, 0.075, 0, 0.15);
        }
      }

      // Create faces for the ribbon (box-shaped)
      for (let i = 0; i < path.length - 1; i++) {
        const base = i * 4;
        const next = (i + 1) * 4;

        // Top face
        faces.push(base + 0, next + 0, base + 1);
        faces.push(next + 0, next + 1, base + 1);

        // Bottom face
        faces.push(base + 2, base + 3, next + 2);
        faces.push(next + 2, base + 3, next + 3);

        // Left side
        faces.push(base + 0, base + 2, next + 0);
        faces.push(next + 0, base + 2, next + 2);

        // Right side
        faces.push(base + 1, next + 1, base + 3);
        faces.push(next + 1, next + 3, base + 3);
      }

      // Add starting cap (small end)
      const firstBase = 0;
      faces.push(firstBase + 0, firstBase + 2, firstBase + 1);
      faces.push(firstBase + 1, firstBase + 2, firstBase + 3);

      // Close the end with a flat cap (large end)
      const lastIdx = path.length - 1;
      const lastBase = lastIdx * 4;
      
      // End cap face (flat rectangle)
      faces.push(lastBase + 0, lastBase + 1, lastBase + 2);
      faces.push(lastBase + 1, lastBase + 3, lastBase + 2);

      return { vertices, faces };
    }

    // Generate curved path with start and end angles
    const armPath = generateCurvedPath(segments, radius, startCurveAngle, endCurveAngle);
    const ribbon = generateFlatRibbon(armPath, 1.5, 0.4);

    this.vertex = ribbon.vertices;
    this.faces = ribbon.faces;
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