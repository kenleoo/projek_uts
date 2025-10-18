export class MyObject {
    GL = null;
    SHADER_PROGRAM = null;

    _position = null;
    _color = null;
    _MMatrix = null;

    OBJECT_VERTEX = null;
    OBJECT_FACES = null;


    vertex = [];
    faces = [];
    MODEL_MATRIX = LIBS.get_I4();
    POSITION_MATRIX = LIBS.get_I4();
    MOVE_MATRIX = LIBS.get_I4();

    childs = [];


    constructor(GL, SHADER_PROGRAM, _position, _color) {
        this.GL = GL;
        this.SHADER_PROGRAM = SHADER_PROGRAM;


        this._position = _position;
        this._color = _color;


        this.vertices = [];
        this.faces = [];

        var a = 0.55, b = 0.45, c = 0.55;
        var uSeg = 60, vSeg = 60;

        for (let i = 0; i <= vSeg; i++) {
            let phi = Math.PI * i / vSeg; // 0 to π
            for (let j = 0; j <= uSeg; j++) {
                let theta = 2 * Math.PI * j / uSeg; // 0 to 2π

                let x = a * Math.sin(phi) * Math.cos(theta);
                let y = b * Math.sin(phi) * Math.sin(theta);
                let z = c * Math.cos(phi);

                this.vertices.push(x, y, z);

                // Color gradient: normalized to [0, 1]
                // Use spherical coordinates for color or simple normalized position
                this.vertices.push((x / a + 1) / 2, (y / b + 1) / 2, (z / c + 1) / 2);
            }
        }

        // Faces (triangles)
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

        this.childs = [];
    }


    setup() {
        this.OBJECT_VERTEX = this.GL.createBuffer();
        this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
        this.GL.bufferData(this.GL.ARRAY_BUFFER,
            new Float32Array(this.vertices),
            this.GL.STATIC_DRAW);


        this.OBJECT_FACES = this.GL.createBuffer();
        this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
        this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.faces),
            this.GL.STATIC_DRAW);

        this.childs.forEach(child => {
            child.setup();
        });
    }


    render(_MMatrix, PARENT_MATRIX) {
        // Combine parent * position * move
        this.MODEL_MATRIX = LIBS.multiply(PARENT_MATRIX, this.POSITION_MATRIX);
        this.MODEL_MATRIX = LIBS.multiply(this.MODEL_MATRIX, this.MOVE_MATRIX);

        this.GL.useProgram(this.SHADER_PROGRAM);
        this.GL.uniformMatrix4fv(_MMatrix, false, this.MODEL_MATRIX);

        this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
        this.GL.vertexAttribPointer(this._position, 3, this.GL.FLOAT, false, 4 * (3 + 3), 0);
        this.GL.vertexAttribPointer(this._color, 3, this.GL.FLOAT, false, 4 * (3 + 3), 4 * 3);

        this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
        this.GL.drawElements(this.GL.TRIANGLES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);

        // Render children (strap)
        this.childs.forEach(child => {
            child.render(_MMatrix, this.MODEL_MATRIX);
        });
    }

}