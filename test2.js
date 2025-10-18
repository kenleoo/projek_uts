import { Head } from "./Chandelure/Head.js";
import { HeadStrip } from "./Chandelure/HeadStrip.js";
import { HeadVerticalStrip } from "./Chandelure/HeadVerticalStrip.js";
import { HeadEye } from "./Chandelure/HeadEye.js";
import { BodyCone } from "./Chandelure/BodyCone.js";
import { BodyParaboloid } from "./Chandelure/BodyParaboloid.js";

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
  var Object1 = new Head(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadStrip1 = new HeadStrip(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadVerticalStrip1 = new HeadVerticalStrip(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadEye1 = new HeadEye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadEye2 = new HeadEye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var Object2 = new BodyCone(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var BodyParaboloid1 = new BodyParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);

  // Child object relationship
  Object1.childs.push(HeadStrip1);
  Object1.childs.push(HeadVerticalStrip1);
  Object1.childs.push(HeadEye1);
  Object1.childs.push(HeadEye2);
  Object1.childs.push(Object2);
  Object2.childs.push(BodyParaboloid1);

  // Scale + Positioning objects
  //object1 (head)
  LIBS.rotateX(Object1.MOVE_MATRIX, 90 * Math.PI / 180);
  LIBS.rotateY(Object1.MOVE_MATRIX, 90 * Math.PI / 180);
  LIBS.scaleX(Object1.POSITION_MATRIX, 2);
  LIBS.scaleY(Object1.POSITION_MATRIX, 2);
  LIBS.scaleZ(Object1.POSITION_MATRIX, 2);
  //eye kanan
  LIBS.rotateY(HeadEye1.MOVE_MATRIX, 90 * Math.PI / 180);
  LIBS.rotateZ(HeadEye1.MOVE_MATRIX, -45 * Math.PI / 180);
  LIBS.translateY(HeadEye1.MOVE_MATRIX, 0.381);
  LIBS.translateX(HeadEye1.MOVE_MATRIX, -0.39);
  //eye kiri
  LIBS.rotateY(HeadEye2.MOVE_MATRIX, 90 * Math.PI / 180);
  LIBS.rotateZ(HeadEye2.MOVE_MATRIX, 45 * Math.PI / 180);
  LIBS.translateY(HeadEye2.MOVE_MATRIX, -0.381);
  LIBS.translateX(HeadEye2.MOVE_MATRIX, -0.39);
  //object2 (body paraboloid)
  LIBS.scaleX(Object2.POSITION_MATRIX, 0.1);
  LIBS.scaleY(Object2.POSITION_MATRIX, 0.1);
  LIBS.scaleZ(Object2.POSITION_MATRIX, 0.1);
  LIBS.rotateX(Object2.MOVE_MATRIX, -90 * Math.PI / 180);
  LIBS.translateZ(Object2.MOVE_MATRIX, 4.325);

  //body paraboloid1
  LIBS.translateY(BodyParaboloid1.MOVE_MATRIX,-1.8);

  // LIBS.translateY(Object2.POSITION_MATRIX, -1.7);

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

  Object1.setup();

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
    LIBS.translateZ(cam, -12);
    // apply pitch (PHI) then yaw (THETA)
    LIBS.rotateX(cam, PHI);
    LIBS.rotateY(cam, THETA);

    GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
    GL.uniformMatrix4fv(_Vmatrix, false, cam);

    Object1.render(LIBS.get_I4());

    GL.flush();
    window.requestAnimationFrame(animate);
  };
  animate(0);
}
window.addEventListener("load", main);
