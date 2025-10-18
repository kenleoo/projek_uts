// ModifiedEllipsoid.js
// depends on LIBS.js provided in your code

export class ModifiedEllipsoid {
    constructor(gl, rx = 1, ry = 1, rz = 1, latBands = 32, lonBands = 32) {
        this.gl = gl;
        this.rx = rx;   // radius x
        this.ry = ry;   // radius y
        this.rz = rz;   // radius z
        this.latBands = latBands;
        this.lonBands = lonBands;

        this.vertexBuffer = null;
        this.normalBuffer = null;
        this.indexBuffer = null;

        this.initBuffers();
    }

    // generate vertices and normals for modified ellipsoid
    initBuffers() {
        const vertices = [];
        const normals = [];
        const indices = [];

        for (let lat = 0; lat <= this.latBands; lat++) {
            const theta = lat * Math.PI / this.latBands;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let lon = 0; lon <= this.lonBands; lon++) {
                const phi = lon * 2 * Math.PI / this.lonBands;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                // === modified ellipsoid formula ===
                let x = this.rx * sinTheta * cosPhi;
                let y = this.ry * cosTheta;
                let z = this.rz * sinTheta * sinPhi;

                // example modification: squash effect + twist
                let twist = 0.3 * y; // twist factor proportional to y
                let xt = x * Math.cos(twist) - z * Math.sin(twist);
                let zt = x * Math.sin(twist) + z * Math.cos(twist);
                x = xt;
                z = zt;

                vertices.push(x, y, z);

                // normal = normalized position (approx for ellipsoid)
                const nx = x / this.rx;
                const ny = y / this.ry;
                const nz = z / this.rz;
                const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
                normals.push(nx / length, ny / length, nz / length);
            }
        }

        // indices
        for (let lat = 0; lat < this.latBands; lat++) {
            for (let lon = 0; lon < this.lonBands; lon++) {
                const first = (lat * (this.lonBands + 1)) + lon;
                const second = first + this.lonBands + 1;

                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }

        const gl = this.gl;

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        this.indexCount = indices.length;
    }

    draw(programInfo) {
        const gl = this.gl;

        // positions
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

        // normals
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);

        // indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    }
}
