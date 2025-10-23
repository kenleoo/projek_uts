// export class Hair { ... }

export class Hair {
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
    radius = 1.0,
    height = 0.5,
    segments = 32, // Jumlah segmen untuk membuat lingkaran halus
    cheeseColor = [1.0, 1.0, 1.0], // Kuning keju
    rindColor = [1.0, 1.0, 1.0], // Cokelat tua untuk kulit keju (rind)
    sliceAngle = 0, // Sudut potongan (dalam radian)
    bulgeFactor = 0.2, // Faktor kecembungan kulit (0 = silinder lurus)
    // PARAMETER LUBANG
    holeAngle = 0,          // Angular width of the hole (lebar lubang tembak)
    holeVerticalOffset = 0.0, // Pergeseran posisi vertikal lubang
    holeHorizontalOffset = 0.0 // BARU: Pergeseran posisi horizontal (rotasi) lubang (dalam radian)
  ) {
    this.GL = GL;
    this.SHADER_PROGRAM = SHADER_PROGRAM;
    this._position = _position;
    this._color = _color;
    this._MMatrix = _MMatrix;

    this.vertex = [];
    this.faces = [];

    // --- Setup Geometri ---
    const angleStart = sliceAngle / 2;
    const angleEnd = 2 * Math.PI - sliceAngle / 2;
    const totalAngle = angleEnd - angleStart;
    const halfHeight = height / 2;
    
    const verticalLayers = 8; 
    const layerStep = height / (verticalLayers - 1);
    const edgeReductionFactor = 0.05; 

    // --- Kalkulasi Lubang Vertikal ---
    const holeSizeInLayers = 2; 
    const centerLayerIndex = Math.floor(verticalLayers / 2);
    const offsetLayers = Math.round(holeVerticalOffset / layerStep);
    
    const holeBottomLayer = centerLayerIndex + offsetLayers - Math.floor(holeSizeInLayers / 2);
    const holeTopLayer = holeBottomLayer + holeSizeInLayers;

    // --- Kalkulasi Lubang Horizontal (Angular) ---
    const segmentsPerRadian = segments / totalAngle;
    const holeSegments = Math.ceil(holeAngle * segmentsPerRadian);
    
    // Konversi offset horizontal dari radian ke jumlah segmen
    const offsetSegments = Math.round(holeHorizontalOffset * segmentsPerRadian);
    
    // Lubang Depan (ditempatkan di tengah total segmen, lalu digeser)
    let frontHoleStart = Math.floor(segments / 2) - Math.floor(holeSegments / 2) + offsetSegments;
    
    // Pastikan nilai tidak negatif dan sesuai dengan total segmen
    frontHoleStart = (frontHoleStart % segments + segments) % segments; 
    const frontHoleEnd = frontHoleStart + holeSegments;
    
    // Lubang Belakang (berjarak 180 derajat)
    const backShift = Math.floor(segments / 2);
    let backHoleStart = frontHoleStart + backShift;
    
    // Pastikan nilai tidak negatif dan sesuai dengan total segmen
    backHoleStart = backHoleStart % segments;
    const backHoleEnd = backHoleStart + holeSegments;


    // --- Vertex Center (Pusat Atas dan Bawah) ---
    // Index 0: Center Top
    const centerTopIndex = this.vertex.length / 6;
    this.vertex.push(0, halfHeight, 0, ...cheeseColor); 

    // Index 1: Center Bottom
    const centerBottomIndex = this.vertex.length / 6;
    this.vertex.push(0, -halfHeight, 0, ...cheeseColor);

    // --- Vertex Lingkaran Samping ---
    const segmentAngle = totalAngle / segments;
    const startIndex = this.vertex.length / 6;
    
    for (let j = 0; j < verticalLayers; j++) {
        const y = -halfHeight + j * layerStep;
        
        const normalizedY = y / halfHeight;
        const normalizedYsq = normalizedY * normalizedY; 

        const currentBulge = bulgeFactor * (1 - normalizedYsq);
        const edgeTaper = edgeReductionFactor * normalizedYsq; 
        
        const currentRadius = radius + currentBulge - edgeTaper;
        
        const layerColor = j === 0 || j === verticalLayers - 1 ? cheeseColor : rindColor;

        for (let i = 0; i <= segments; i++) {
            const theta = angleStart + i * segmentAngle;
            const x = Math.cos(theta) * currentRadius;
            const z = Math.sin(theta) * currentRadius;

            this.vertex.push(x, y, z, ...layerColor);
        }
    }


    // --- Face Permukaan Atas dan Bawah --- (tetap sama)
    const topLayerStart = startIndex + (verticalLayers - 1) * (segments + 1);
    for (let i = 0; i < segments; i++) {
        const p1 = topLayerStart + i;
        const p2 = topLayerStart + i + 1;
        this.faces.push(centerTopIndex, p2, p1);
    }
    
    const bottomLayerStart = startIndex + 0;
    for (let i = 0; i < segments; i++) {
        const p1 = bottomLayerStart + i;
        const p2 = bottomLayerStart + i + 1;
        this.faces.push(centerBottomIndex, p1, p2); 
    }

    // --- Face Samping/Kulit (Menggambar Rind, Melewatkan Lubang) ---
    for (let j = 0; j < verticalLayers - 1; j++) {
        const layer1Start = startIndex + j * (segments + 1);
        const layer2Start = startIndex + (j + 1) * (segments + 1);

        for (let i = 0; i < segments; i++) {
            // Check segment i against hole segments, handling wrap-around for back hole
            const isFrontHoleSegment = (i >= frontHoleStart && i < frontHoleEnd) || 
                                       (frontHoleEnd > segments && i < (frontHoleEnd % segments));
            const isBackHoleSegment = (i >= backHoleStart && i < backHoleEnd) ||
                                      (backHoleEnd > segments && i < (backHoleEnd % segments));
            
            const isHoleVerticalLayer = (j >= holeBottomLayer && j < holeTopLayer);

            if ((!isFrontHoleSegment && !isBackHoleSegment) || !isHoleVerticalLayer || holeAngle === 0) {
                const p1 = layer1Start + i;     
                const p2 = layer2Start + i;     
                const p3 = layer2Start + i + 1; 
                const p4 = layer1Start + i + 1; 

                this.faces.push(p1, p2, p3); 
                this.faces.push(p1, p3, p4); 
            }
        }
    }

    // --- Face Interior Lubang (Tunnel) ---
    if (holeAngle > 0) {
        for (let j = holeBottomLayer; j < holeTopLayer; j++) {
            const layer1Start = startIndex + j * (segments + 1);
            const layer2Start = startIndex + (j + 1) * (segments + 1);

            // Tepi Kiri Lubang (Segmen frontHoleStart & backHoleEnd)
            let p1_front = layer1Start + (frontHoleStart % segments);
            let p2_front = layer2Start + (frontHoleStart % segments);
            
            let p1_back = layer1Start + (backHoleEnd % segments);
            let p2_back = layer2Start + (backHoleEnd % segments);
            
            this.faces.push(p1_front, p2_back, p2_front);
            this.faces.push(p1_front, p1_back, p2_back);

            // Tepi Kanan Lubang (Segmen frontHoleEnd & backHoleStart)
            p1_front = layer1Start + (frontHoleEnd % segments);
            p2_front = layer2Start + (frontHoleEnd % segments);
            
            p1_back = layer1Start + (backHoleStart % segments);
            p2_back = layer2Start + (backHoleStart % segments);
            
            this.faces.push(p1_front, p2_front, p2_back);
            this.faces.push(p1_front, p2_back, p1_back);
        }
    }
    

    // --- Face Irisan (Jika ada sliceAngle) --- (tetap sama)
    if (sliceAngle > 0) {
        // Sisi irisan di awal (theta = angleStart)
        for (let j = 0; j < verticalLayers - 1; j++) {
            const p1 = startIndex + j * (segments + 1);
            const p2 = startIndex + (j + 1) * (segments + 1);
            this.faces.push(p1, p2, centerTopIndex);
            this.faces.push(p1, centerTopIndex, centerBottomIndex);
        }
        
        // Sisi irisan di akhir (theta = angleEnd)
        for (let j = 0; j < verticalLayers - 1; j++) {
            const p1 = startIndex + j * (segments + 1) + segments;
            const p2 = startIndex + (j + 1) * (segments + 1) + segments;

            this.faces.push(p1, centerTopIndex, p2); 
            this.faces.push(p1, centerBottomIndex, centerTopIndex);
        }
    }
  }
  
  // Metode setup() dan render() tetap sama seperti sebelumnya
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