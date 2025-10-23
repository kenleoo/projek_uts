import { Head } from "./Litwick/Head.js";
import { BodyClylinder } from "./Litwick/Feet.js";
import { HeadTip } from "./Litwick/HeadFlame.js";
import {HeadEye} from "./Litwick/HeadEye.js";
import { Hair } from "./Litwick/Hair.js";
import { NoseHand } from "./Litwick/NoseOrHandParaboloid.js";
import { Scalp } from "./Litwick/Scalp.js";


function main() {
    /** @type {HTMLCanvasElement} */
    var CANVAS = document.getElementById("mycanvas");
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    /*===================== GET WEBGL CONTEXT ===================== */
    /** @type {WebGLRenderingContext} */
    var GL;
    try {
        GL = CANVAS.getContext("webgl", { antialias: true });
    } catch (e) {
        alert("WebGL context cannot be initialized");
        return false;
    }

    /*========================= SHADERS ========================= */
    var shader_vertex_source = `
        attribute vec3 position;
        uniform mat4 Pmatrix, Vmatrix, Mmatrix;
        attribute vec3 color;
        varying vec3 vColor;

        void main(void) {
            gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);
            vColor = color;
        }`;

    var shader_fragment_source = `
        precision mediump float;
        varying vec3 vColor;

        void main(void) {
            gl_FragColor = vec4(vColor, 1.);
        }`;

    var compile_shader = function (source, type, typeString) {
        var shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    };
    var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    var SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);

    GL.linkProgram(SHADER_PROGRAM);

    var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
    GL.enableVertexAttribArray(_position);

    var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
    GL.enableVertexAttribArray(_color);

    var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
    var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
    var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");

    GL.useProgram(SHADER_PROGRAM);

    // Objects
    // var TopHat = new TopHat(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.075, 0, 0.15], 1, 4);
    var Object1 = new Head(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);

    var Nose = new NoseHand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var Left_hand = new NoseHand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var Right_hand = new NoseHand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    // var hair = new Hair(GL, SHADER_PROGRAM, _position, _color, _Mmatrix)
    // Example: Create a cheese wheel with a 45-degree slice and a 10-degree hole in the middle vertical layer (index 2)
// Contoh: Keju cembung dengan lubang tembus 5 derajat (sangat kecil, seperti tembakan)
// Contoh pemanggilan di main.js:

var hair = new Hair(
    GL, 
    SHADER_PROGRAM, 
    _position, 
    _color, 
    _Mmatrix,
    0.7,     // radius
    0.8,     // height
    32,      // segments
    [0.95,0.95,0.85], // gradient color
    [0.95,0.95,0.85],  // color
    
);

var hair2 = new Hair(
    GL, 
    SHADER_PROGRAM, 
    _position, 
    _color, 
    _Mmatrix,
    0.7,     // radius
    0.8,     // height
    32,      // segments
    [0.95,0.95,0.85], // gradient color
    [0.95,0.95,0.85],  // color
    
);

var hair3 = new Hair(
    GL, 
    SHADER_PROGRAM, 
    _position, 
    _color, 
    _Mmatrix,
    0.7,     // radius
    0.8,     // height
    32,      // segments
    [0.95,0.95,0.85], // gradient color
    [0.95,0.95,0.85],  // color
    
);


    var BodyClylinder1 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var Eyes = new HeadEye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);

    var feet1 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var feet2 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var feet3 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var feet4 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var feet5 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var feet6 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var feet7 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);

    var HeadTip1 = new HeadTip(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);

    var scalp = new Scalp(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);


    // Child object relationship
BodyClylinder1.childs.push(
  Object1,
  Eyes,
  feet1, feet2, feet3, feet4, feet5, feet6, feet7,
  HeadTip1,
  Nose,
  Left_hand,
  Right_hand,
  hair, hair2, hair3,
  scalp
);

    // Scale + Positioning objects

// ====== Hair / Wax positioning ======

// Middle hair
LIBS.translateX(hair.POSITION_MATRIX, -0);
LIBS.translateY(hair.POSITION_MATRIX, 0.28);
LIBS.translateZ(hair.POSITION_MATRIX, 0);

LIBS.scaleX(hair.POSITION_MATRIX, 0.3);
LIBS.scaleY(hair.POSITION_MATRIX, 0.4);
LIBS.scaleZ(hair.POSITION_MATRIX, 0.45);

LIBS.rotateX(hair.POSITION_MATRIX, Math.PI)

// Left-side hair
LIBS.translateX(hair2.POSITION_MATRIX, 0.07);
LIBS.translateY(hair2.POSITION_MATRIX, 0.28);
LIBS.translateZ(hair2.POSITION_MATRIX, 0);

LIBS.scaleX(hair2.POSITION_MATRIX, 0.4);
LIBS.scaleY(hair2.POSITION_MATRIX, 0.4);
LIBS.scaleZ(hair2.POSITION_MATRIX, 0.35);

LIBS.rotateX(hair2.POSITION_MATRIX, Math.PI)

// Right-side hair
LIBS.translateX(hair3.POSITION_MATRIX, -0.07);
LIBS.translateY(hair3.POSITION_MATRIX, 0.24);
LIBS.translateZ(hair3.POSITION_MATRIX, 0);

LIBS.scaleX(hair3.POSITION_MATRIX, 0.4);
LIBS.scaleY(hair3.POSITION_MATRIX, 0.5);
LIBS.scaleZ(hair3.POSITION_MATRIX, 0.4);

LIBS.rotateX(hair3.POSITION_MATRIX, Math.PI)



    // feet1 front-left
    LIBS.translateZ(feet1.POSITION_MATRIX, 0.2)
    LIBS.translateY(feet1.POSITION_MATRIX, -0.2)
    LIBS.translateX(feet1.POSITION_MATRIX, 0.2)
    LIBS.scaleX(feet1.POSITION_MATRIX, 1.5)
    LIBS.scaleZ(feet1.POSITION_MATRIX, 1.5)

    LIBS.scaleY(feet1.POSITION_MATRIX, 0.3)
    // feet2 front-right
    LIBS.translateZ(feet2.POSITION_MATRIX, 0.2)
    LIBS.translateY(feet2.POSITION_MATRIX, -0.2)
    LIBS.translateX(feet2.POSITION_MATRIX, -0.2)
    LIBS.scaleX(feet2.POSITION_MATRIX, 1.5)
    LIBS.scaleZ(feet2.POSITION_MATRIX, 1.5)

    LIBS.scaleY(feet2.POSITION_MATRIX, 0.3)
    // feet3 front-middle
    LIBS.translateY(feet3.POSITION_MATRIX, -0.2)
    LIBS.translateZ(feet3.POSITION_MATRIX, 0.3)
    LIBS.scaleX(feet3.POSITION_MATRIX, 1.5)
    LIBS.scaleZ(feet3.POSITION_MATRIX, 1.5)

    LIBS.scaleY(feet3.POSITION_MATRIX, 0.3)
    // feet4 middle-right
    LIBS.translateZ(feet4.POSITION_MATRIX, 0)
    LIBS.translateY(feet4.POSITION_MATRIX, -0.2)
    LIBS.translateX(feet4.POSITION_MATRIX, 0.15)
    LIBS.scaleX(feet4.POSITION_MATRIX, 1.5)
    LIBS.scaleZ(feet4.POSITION_MATRIX, 1.5)

    LIBS.scaleY(feet4.POSITION_MATRIX, 0.3)
    // feet5 middle-middle
    LIBS.translateY(feet5.POSITION_MATRIX, -0.2)
    LIBS.translateZ(feet5.POSITION_MATRIX, 0)
    LIBS.scaleY(feet5.POSITION_MATRIX, 0.3)
    LIBS.scaleZ(feet5.POSITION_MATRIX, 2)
    LIBS.scaleX(feet5.POSITION_MATRIX, 2)
    // feet6 middle-left
    LIBS.translateZ(feet6.POSITION_MATRIX, 0)
    LIBS.translateY(feet6.POSITION_MATRIX, -0.2)
    LIBS.translateX(feet6.POSITION_MATRIX, -0.15)
    LIBS.scaleX(feet6.POSITION_MATRIX, 1.5)
    LIBS.scaleZ(feet6.POSITION_MATRIX, 1.5)

    LIBS.scaleY(feet6.POSITION_MATRIX, 0.3)
    // feet7 back the big one
    LIBS.translateZ(feet7.POSITION_MATRIX, -0.15)
    LIBS.translateY(feet7.POSITION_MATRIX, -0.2)
    LIBS.scaleY(feet7.POSITION_MATRIX, 0.3)
    LIBS.scaleZ(feet7.POSITION_MATRIX, 2)
    LIBS.scaleX(feet7.POSITION_MATRIX, 2)

    // object1 (head)
    LIBS.scaleX(Object1.POSITION_MATRIX, 0.5);
    LIBS.scaleY(Object1.POSITION_MATRIX, 0.45);
    LIBS.scaleZ(Object1.POSITION_MATRIX, 0.5);
    LIBS.rotateX(Object1.MOVE_MATRIX, 3.15)

    // eye left
    LIBS.translateX(Eyes.POSITION_MATRIX, 0.2)
    LIBS.translateZ(Eyes.POSITION_MATRIX, 0.25)
    LIBS.translateY(Eyes.POSITION_MATRIX, 0.09)
    LIBS.scaleX(Eyes.POSITION_MATRIX, 0.3)
    LIBS.scaleY(Eyes.POSITION_MATRIX, 0.7)
    LIBS.rotateX(Eyes.MOVE_MATRIX, 0.25)
    LIBS.rotateY(Eyes.MOVE_MATRIX, 0.25)

    // head tip
    LIBS.scaleX(HeadTip1.POSITION_MATRIX, 0.6);
    LIBS.scaleY(HeadTip1.POSITION_MATRIX, 0.2);
    LIBS.scaleZ(HeadTip1.POSITION_MATRIX, 0.6);
    LIBS.rotateX(HeadTip1.MOVE_MATRIX, -90 * (Math.PI / 180));
    LIBS.translateY(HeadTip1.POSITION_MATRIX, 0.5);

    // scalp paraboloid
    // LIBS.scaleX(TopBodyParaboloid.POSITION_MATRIX, 0.055);
    // LIBS.scaleY(TopBodyParaboloid.POSITION_MATRIX, 0.09);
    // LIBS.scaleZ(TopBodyParaboloid.POSITION_MATRIX, 0.055);
    // LIBS.translateY(TopBodyParaboloid.POSITION_MATRIX, 1);
    // LIBS.rotateX(TopBodyParaboloid.MOVE_MATRIX, 3.15)

    // scalp
    LIBS.scaleX(scalp.POSITION_MATRIX, 0.55);
    LIBS.scaleY(scalp.POSITION_MATRIX, 0.3);
    LIBS.scaleZ(scalp.POSITION_MATRIX, 0.5);
    LIBS.translateY(scalp.POSITION_MATRIX, 0.38);
    LIBS.rotateX(scalp.MOVE_MATRIX, 3.15)

    // nose
    LIBS.scaleX(Nose.POSITION_MATRIX, 0.15)
    LIBS.scaleY(Nose.POSITION_MATRIX, 3)
    LIBS.scaleZ(Nose.POSITION_MATRIX, 0.1)
    LIBS.translateZ(Nose.POSITION_MATRIX, -2.5)
    LIBS.translateY(Nose.POSITION_MATRIX, 0.85)
    LIBS.rotateX(Nose.POSITION_MATRIX, 5)

    // left hand
    LIBS.scaleX(Left_hand.POSITION_MATRIX, 0.1)
    LIBS.scaleY(Left_hand.POSITION_MATRIX, 3)
    LIBS.scaleZ(Left_hand.POSITION_MATRIX, 0.1)
    LIBS.translateX(Left_hand.POSITION_MATRIX, -1.8)
    LIBS.translateY(Left_hand.POSITION_MATRIX, 2)
    LIBS.rotateZ(Left_hand.POSITION_MATRIX, -5.5)

    // right hand
    LIBS.scaleX(Right_hand.POSITION_MATRIX, 0.1)
    LIBS.scaleY(Right_hand.POSITION_MATRIX, 3)
    LIBS.scaleZ(Right_hand.POSITION_MATRIX, 0.1)
    LIBS.translateX(Right_hand.POSITION_MATRIX, 1.8)
    LIBS.translateY(Right_hand.POSITION_MATRIX, 2)
    LIBS.rotateZ(Right_hand.POSITION_MATRIX, 5.5)
    

    // body cylinder
    LIBS.translateY(BodyClylinder1.POSITION_MATRIX, -0.1);
    LIBS.scaleX(BodyClylinder1.POSITION_MATRIX, 2.5);
    LIBS.scaleY(BodyClylinder1.POSITION_MATRIX, 2.5);
    LIBS.scaleZ(BodyClylinder1.POSITION_MATRIX, 2.5);



    var PROJMATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    // var MOVEMATRIX = LIBS.get_I4();
    var VIEWMATRIX = LIBS.get_I4();

    LIBS.translateZ(VIEWMATRIX, -12);

    /*========================= Mouse & Keyboard ========================= */
    var THETA = 0;
    var PHI = 0;
    var drag = false;
    var x_prev, y_prev;
    var FRICTION = 0.05;
    var dX = 0;
    var dY = 0;

        /*========================= Zoom (Mouse Wheel) =========================*/
    var ZOOM = -12; // starting distance, same as translateZ(VIEWMATRIX, -12)
    var ZOOM_SPEED = 0.5; // how fast to zoom
    var MIN_ZOOM = -30;   // farthest out
    var MAX_ZOOM = -3;    // closest in

    var mouseWheel = function (e) {
        e.preventDefault();
        // normalize wheel direction (some browsers invert)
        var delta = e.deltaY < 0 ? 1 : -1;
        ZOOM += delta * ZOOM_SPEED;
        if (ZOOM < MIN_ZOOM) ZOOM = MIN_ZOOM;
        if (ZOOM > MAX_ZOOM) ZOOM = MAX_ZOOM;
    };

    CANVAS.addEventListener("wheel", mouseWheel, { passive: false });


    var mouseDown = function (e) {
        drag = true;
        (x_prev = e.pageX), (y_prev = e.pageY);
        e.preventDefault();
        return false;
    };

    var mouseUp = function () {
        drag = false;
    };

    var mouseMove = function (e) {
        if (!drag) return false;
        dX = ((e.pageX - x_prev) * 2 * Math.PI) / CANVAS.width;
        dY = ((e.pageY - y_prev) * 2 * Math.PI) / CANVAS.height;
        THETA += dX;
        PHI += dY;
        (x_prev = e.pageX), (y_prev = e.pageY);
        e.preventDefault();
    };

    CANVAS.addEventListener("mousedown", mouseDown, false);
    CANVAS.addEventListener("mouseup", mouseUp, false);
    CANVAS.addEventListener("mouseout", mouseUp, false);
    CANVAS.addEventListener("mousemove", mouseMove, false);

    /*========================= DRAWING ========================= */
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clearColor(0.0, 0.0, 0.0, 0.0);
    GL.clearDepth(1.0);

    BodyClylinder1.setup();

    /*========================= Animation ========================= */
    var time_prev = 0;
    var animate = function (time) {
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT);

        var dt = time - time_prev;
        time_prev = time;
        // LIBS.rotateY(Object1.MOVE_MATRIX, dt * 0.001);
        // LIBS.rotateX(Object3.MOVE_MATRIX, dt * -0.001);
        // LIBS.rotateX(Object4.MOVE_MATRIX, dt * 0.001);

        // apply simple camera rotation from mouse drag (THETA, PHI)
        // rebuild VIEWMATRIX each frame from identity so rotations accumulate only from THETA/PHI
        var cam = LIBS.get_I4();
        // move camera back first
                LIBS.translateZ(cam, ZOOM);
        // apply pitch (PHI) then yaw (THETA)
        LIBS.rotateX(cam, PHI);
        LIBS.rotateY(cam, THETA);

        GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
        GL.uniformMatrix4fv(_Vmatrix, false, cam);

        BodyClylinder1.render(LIBS.get_I4());

        GL.flush();
        window.requestAnimationFrame(animate);
    };
    animate(0);
}
window.addEventListener("load", main);
