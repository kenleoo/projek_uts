import { Head } from "./Chandelure/Head.js";
import { HeadStrip } from "./Chandelure/HeadStrip.js";
import { HeadStrip2 } from "./Chandelure/HeadStrip2.js";
import { HeadVerticalStrip } from "./Chandelure/HeadVerticalStrip.js";
import { HeadEye } from "./Chandelure/HeadEye.js";
import { HeadEyeOutline } from "./Chandelure/HeadEyeOutline.js";
import { BodyCone } from "./Chandelure/BodyCone.js";
import { BodyParaboloid } from "./Chandelure/BodyParaboloid.js";
import { HeadCrown } from "./Chandelure/HeadCrown.js";
import { CrownOutline } from "./Chandelure/CrownOutline.js";
import { HeadFlame } from "./Chandelure/HeadFlame.js";
import { Hand } from "./Chandelure/Hand.js";
import { SubHand } from "./Chandelure/SubHand.js";
import { HandParaboloid } from "./Chandelure/HandParaboloid.js";
import { HandCrown } from "./Chandelure/HandCrown.js";
import { HandFlame } from "./Chandelure/HandFlame.js";

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
        attribute vec4 color;
        varying vec4 vColor;

        void main(void) {
            gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);
            vColor = color;
        }`;

  var shader_fragment_source = `
        precision mediump float;
        varying vec4 vColor;

        void main(void) {
          gl_FragColor = vColor;
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
  GL.enable(GL.BLEND);
  GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA); 


  // Objects
  var Object1 = new Head(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadStrip1 = new HeadStrip(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadVerticalStrip1 = new HeadVerticalStrip(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadEye1 = new HeadEye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadEye2 = new HeadEye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadEyeOutline1 = new HeadEyeOutline(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadEyeOutline2 = new HeadEyeOutline(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadStripMid = new HeadStrip2(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadCrown1 = new HeadCrown(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var Object2 = new BodyCone(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var BodyParaboloid1 = new BodyParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var CrownOutline1 = new CrownOutline(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadFlame1 = new HeadFlame(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var Hand1 = new Hand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var Hand2 = new Hand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var SubHand1 = new SubHand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HandParaboloid1 = new HandParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HandCrown1 = new HandCrown(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HandFlame1 = new HandFlame(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var SubHand2 = new SubHand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HandParaboloid2 = new HandParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HandCrown2 = new HandCrown(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HandFlame2 = new HandFlame(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var SubHand3 = new SubHand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HandParaboloid3 = new HandParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HandCrown3 = new HandCrown(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HandFlame3 = new HandFlame(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var SubHand4 = new SubHand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HandParaboloid4 = new HandParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HandCrown4 = new HandCrown(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HandFlame4 = new HandFlame(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);

  // Child object relationship
  Object1.childs.push(HeadStrip1);
  Object1.childs.push(HeadVerticalStrip1);
  Object1.childs.push(HeadStripMid);
  Object1.childs.push(HeadEye1);
  Object1.childs.push(HeadEye2);
  Object1.childs.push(CrownOutline1);
  Object1.childs.push(HeadCrown1);
  HeadEye1.childs.push(HeadEyeOutline1);
  HeadEye2.childs.push(HeadEyeOutline2);
  Object1.childs.push(Object2);
  Object2.childs.push(BodyParaboloid1);
  Object1.childs.push(HeadFlame1);
  Object2.childs.push(Hand1);
  Object2.childs.push(Hand2);
  Hand1.childs.push(SubHand1);
  SubHand1.childs.push(HandParaboloid1);
  HandParaboloid1.childs.push(HandCrown1);
  HandCrown1.childs.push(HandFlame1);
  Hand1.childs.push(SubHand2);
  SubHand2.childs.push(HandParaboloid2);
  HandParaboloid2.childs.push(HandCrown2);
  HandCrown2.childs.push(HandFlame2);
  Hand2.childs.push(SubHand3);
  SubHand3.childs.push(HandParaboloid3);
  HandParaboloid3.childs.push(HandCrown3);
  HandCrown3.childs.push(HandFlame3);
  Hand2.childs.push(SubHand4);
  SubHand4.childs.push(HandParaboloid4);
  HandParaboloid4.childs.push(HandCrown4);
  HandCrown4.childs.push(HandFlame4);


  // Scale + Positioning objects
  //object1 (head)
  LIBS.rotateX(Object1.MOVE_MATRIX, 90 * Math.PI / 180);
  LIBS.rotateY(Object1.MOVE_MATRIX, 90 * Math.PI / 180);
  LIBS.scaleX(Object1.POSITION_MATRIX, 1.5);
  LIBS.scaleY(Object1.POSITION_MATRIX, 1.5);
  LIBS.scaleZ(Object1.POSITION_MATRIX, 1.5);
  //eye kanan
  LIBS.rotateY(HeadEye1.MOVE_MATRIX, 90 * Math.PI / 180);
  LIBS.rotateZ(HeadEye1.MOVE_MATRIX, -45 * Math.PI / 180);
  LIBS.translateY(HeadEye1.MOVE_MATRIX, 0.381);
  LIBS.translateX(HeadEye1.MOVE_MATRIX, -0.37);
  //eye kiri
  LIBS.rotateY(HeadEye2.MOVE_MATRIX, 90 * Math.PI / 180);
  LIBS.rotateZ(HeadEye2.MOVE_MATRIX, 45 * Math.PI / 180);
  LIBS.translateY(HeadEye2.MOVE_MATRIX, -0.381);
  LIBS.translateX(HeadEye2.MOVE_MATRIX, -0.37);
  //head crown
  LIBS.scaleX(HeadCrown1.POSITION_MATRIX, 0.15);
  LIBS.scaleY(HeadCrown1.POSITION_MATRIX, 0.15);
  LIBS.scaleZ(HeadCrown1.POSITION_MATRIX, 0.15);
  LIBS.rotateX(HeadCrown1.MOVE_MATRIX, -90 * Math.PI / 180);
  LIBS.translateZ(HeadCrown1.MOVE_MATRIX, -3);
  //head flame
  LIBS.scaleX(HeadFlame1.POSITION_MATRIX, 0.6);
  LIBS.scaleY(HeadFlame1.POSITION_MATRIX, 0.6);
  // LIBS.scaleZ(HeadFlame1.POSITION_MATRIX, 0.5);
  LIBS.rotateX(HeadFlame1.POSITION_MATRIX, 180 * Math.PI / 180);
  LIBS.rotateZ(HeadFlame1.POSITION_MATRIX, 90 * Math.PI / 180);
  LIBS.translateX(HeadFlame1.MOVE_MATRIX, -0.05);
  LIBS.translateY(HeadFlame1.MOVE_MATRIX, -0.2);
  LIBS.translateZ(HeadFlame1.MOVE_MATRIX, 0.4);
  //object2 (body paraboloid)
  LIBS.scaleX(Object2.POSITION_MATRIX, 0.1);
  LIBS.scaleY(Object2.POSITION_MATRIX, 0.1);
  LIBS.scaleZ(Object2.POSITION_MATRIX, 0.1);
  LIBS.rotateX(Object2.MOVE_MATRIX, -90 * Math.PI / 180);
  LIBS.translateZ(Object2.MOVE_MATRIX, 4.325);
  //hand kanan
  LIBS.scaleX(Hand1.POSITION_MATRIX, 0.35);
  LIBS.scaleY(Hand1.POSITION_MATRIX, 0.35);
  LIBS.scaleZ(Hand1.POSITION_MATRIX, 0.35);
  LIBS.rotateX(Hand1.MOVE_MATRIX, 90 * Math.PI / 180);
  LIBS.rotateY(Hand1.MOVE_MATRIX, -50 * Math.PI / 180);
  LIBS.rotateZ(Hand1.MOVE_MATRIX, -90 * Math.PI / 180);
  LIBS.translateY(Hand1.MOVE_MATRIX, 13);
  LIBS.translateZ(Hand1.MOVE_MATRIX, 26);
  //hand kiri
  LIBS.scaleX(Hand2.POSITION_MATRIX, 0.35);
  LIBS.scaleY(Hand2.POSITION_MATRIX, 0.35);
  LIBS.scaleZ(Hand2.POSITION_MATRIX, 0.35);
  LIBS.rotateX(Hand2.MOVE_MATRIX, -90 * Math.PI / 180);
  LIBS.rotateY(Hand2.MOVE_MATRIX, 50 * Math.PI / 180);
  LIBS.rotateZ(Hand2.MOVE_MATRIX, -90 * Math.PI / 180);
  LIBS.translateY(Hand2.MOVE_MATRIX, 13);
  LIBS.translateZ(Hand2.MOVE_MATRIX, -26);
  //subhand kanan depan
  LIBS.scaleX(SubHand1.POSITION_MATRIX, 6);
  LIBS.scaleY(SubHand1.POSITION_MATRIX, 6);
  LIBS.scaleZ(SubHand1.POSITION_MATRIX, 6);
  LIBS.rotateX(SubHand1.MOVE_MATRIX, -220 * Math.PI / 180);
  LIBS.rotateY(SubHand1.MOVE_MATRIX, -90  * Math.PI / 180);
  LIBS.rotateZ(SubHand1.MOVE_MATRIX, 80 * Math.PI / 180);
  LIBS.translateX(SubHand1.MOVE_MATRIX, 0.9);
  LIBS.translateY(SubHand1.MOVE_MATRIX, 1.5);
  // LIBS.translateZ(SubHand1.MOVE_MATRIX, -0.5);
  //paraboloid kanan depan
  LIBS.translateY(HandParaboloid1.MOVE_MATRIX, -1);
  LIBS.translateX(HandParaboloid1.MOVE_MATRIX, 1.625);
  LIBS.scaleX(HandParaboloid1.POSITION_MATRIX, 1.25);
  LIBS.scaleY(HandParaboloid1.POSITION_MATRIX, 25);
  LIBS.scaleZ(HandParaboloid1.POSITION_MATRIX, 1.25);
  LIBS.rotateX(HandParaboloid1.MOVE_MATRIX, -180 * Math.PI / 180);
  //crown paraboloid kanan depan
  LIBS.scaleX(HandCrown1.POSITION_MATRIX, 0.335);
  LIBS.scaleY(HandCrown1.POSITION_MATRIX, 0.025);
  LIBS.scaleZ(HandCrown1.POSITION_MATRIX, 0.335);
  LIBS.rotateY(HandCrown1.MOVE_MATRIX, 45 * Math.PI / 180);
  LIBS.translateY(HandCrown1.MOVE_MATRIX, -37.75);
  //body paraboloid1
  LIBS.translateY(BodyParaboloid1.MOVE_MATRIX,-1.8);
  //hand flame kanan depan
  LIBS.scaleX(HandFlame1.POSITION_MATRIX, 3.5);
  LIBS.scaleY(HandFlame1.POSITION_MATRIX, 1.75);
  LIBS.scaleZ(HandFlame1.POSITION_MATRIX, 3.5);
  LIBS.rotateX(HandFlame1.MOVE_MATRIX, -80 * Math.PI / 180);
  LIBS.rotateY(HandFlame1.MOVE_MATRIX, 45 * Math.PI / 180);
  LIBS.rotateZ(HandFlame1.MOVE_MATRIX, 15 * Math.PI / 180);  
  LIBS.translateX(HandFlame1.MOVE_MATRIX, 0.1);
  LIBS.translateZ(HandFlame1.MOVE_MATRIX, 0.1);
  //subhand kanan belakang
  LIBS.scaleX(SubHand2.POSITION_MATRIX, 6);
  LIBS.scaleY(SubHand2.POSITION_MATRIX, 6);
  LIBS.scaleZ(SubHand2.POSITION_MATRIX, 6);
  LIBS.rotateX(SubHand2.MOVE_MATRIX, 220 * Math.PI / 180);
  LIBS.rotateY(SubHand2.MOVE_MATRIX, 90  * Math.PI / 180);
  LIBS.rotateZ(SubHand2.MOVE_MATRIX, 80 * Math.PI / 180);
  LIBS.translateX(SubHand2.MOVE_MATRIX, 0.9);
  LIBS.translateY(SubHand2.MOVE_MATRIX, 1.5);
  //paraboloid kanan belakang
  LIBS.translateY(HandParaboloid2.MOVE_MATRIX, -1);
  LIBS.translateX(HandParaboloid2.MOVE_MATRIX, 1.625);
  LIBS.scaleX(HandParaboloid2.POSITION_MATRIX, 1.25);
  LIBS.scaleY(HandParaboloid2.POSITION_MATRIX, 25);
  LIBS.scaleZ(HandParaboloid2.POSITION_MATRIX, 1.25);
  LIBS.rotateX(HandParaboloid2.MOVE_MATRIX, -180 * Math.PI / 180);
  //crown paraboloid kanan belakang
  LIBS.scaleX(HandCrown2.POSITION_MATRIX, 0.335);
  LIBS.scaleY(HandCrown2.POSITION_MATRIX, 0.025);
  LIBS.scaleZ(HandCrown2.POSITION_MATRIX, 0.335);
  LIBS.rotateY(HandCrown2.MOVE_MATRIX, 45 * Math.PI / 180);
  LIBS.translateY(HandCrown2.MOVE_MATRIX, -37.75);
  //hand flame kanan belakang
  LIBS.scaleX(HandFlame2.POSITION_MATRIX, 3.5);
  LIBS.scaleY(HandFlame2.POSITION_MATRIX, 1.75);
  LIBS.scaleZ(HandFlame2.POSITION_MATRIX, 3.5);
  LIBS.rotateX(HandFlame2.MOVE_MATRIX, -80 * Math.PI / 180);
  LIBS.rotateY(HandFlame2.MOVE_MATRIX, 225 * Math.PI / 180);
  LIBS.rotateZ(HandFlame2.MOVE_MATRIX, -15 * Math.PI / 180);  
  LIBS.translateX(HandFlame2.MOVE_MATRIX, -0.1);
  LIBS.translateZ(HandFlame2.MOVE_MATRIX, -0.1);
  //subhand kiri depan
  LIBS.scaleX(SubHand3.POSITION_MATRIX, 6);
  LIBS.scaleY(SubHand3.POSITION_MATRIX, 6);
  LIBS.scaleZ(SubHand3.POSITION_MATRIX, 6);
  LIBS.rotateX(SubHand3.MOVE_MATRIX, 220 * Math.PI / 180);
  LIBS.rotateY(SubHand3.MOVE_MATRIX, 90  * Math.PI / 180);
  LIBS.rotateZ(SubHand3.MOVE_MATRIX, 80 * Math.PI / 180);
  LIBS.translateX(SubHand3.MOVE_MATRIX, 0.9);
  LIBS.translateY(SubHand3.MOVE_MATRIX, 1.5);
  //paraboloid kiri depan
  LIBS.translateY(HandParaboloid3.MOVE_MATRIX, -1);
  LIBS.translateX(HandParaboloid3.MOVE_MATRIX, 1.625);
  LIBS.scaleX(HandParaboloid3.POSITION_MATRIX, 1.25);
  LIBS.scaleY(HandParaboloid3.POSITION_MATRIX, 25);
  LIBS.scaleZ(HandParaboloid3.POSITION_MATRIX, 1.25);
  LIBS.rotateX(HandParaboloid3.MOVE_MATRIX, -180 * Math.PI / 180);
  //crown paraboloid kiri depan
  LIBS.scaleX(HandCrown3.POSITION_MATRIX, 0.335);
  LIBS.scaleY(HandCrown3.POSITION_MATRIX, 0.025);
  LIBS.scaleZ(HandCrown3.POSITION_MATRIX, 0.335);
  LIBS.rotateY(HandCrown3.MOVE_MATRIX, 45 * Math.PI / 180);
  LIBS.translateY(HandCrown3.MOVE_MATRIX, -37.75);
  //hand flame kiri depan
  LIBS.scaleX(HandFlame3.POSITION_MATRIX, 3.5);
  LIBS.scaleY(HandFlame3.POSITION_MATRIX, 1.75);
  LIBS.scaleZ(HandFlame3.POSITION_MATRIX, 3.5);
  LIBS.rotateX(HandFlame3.MOVE_MATRIX, -80 * Math.PI / 180);
  LIBS.rotateY(HandFlame3.MOVE_MATRIX, 225 * Math.PI / 180);
  LIBS.rotateZ(HandFlame3.MOVE_MATRIX, -15 * Math.PI / 180);
  LIBS.translateX(HandFlame3.MOVE_MATRIX, -0.1);
  LIBS.translateZ(HandFlame3.MOVE_MATRIX, -0.1);  
  //subhand kiri belakang
  LIBS.scaleX(SubHand4.POSITION_MATRIX, 6);
  LIBS.scaleY(SubHand4.POSITION_MATRIX, 6);
  LIBS.scaleZ(SubHand4.POSITION_MATRIX, 6);
  LIBS.rotateX(SubHand4.MOVE_MATRIX, -220 * Math.PI / 180);
  LIBS.rotateY(SubHand4.MOVE_MATRIX, -90  * Math.PI / 180);
  LIBS.rotateZ(SubHand4.MOVE_MATRIX, 80 * Math.PI / 180);
  LIBS.translateX(SubHand4.MOVE_MATRIX, 0.9);
  LIBS.translateY(SubHand4.MOVE_MATRIX, 1.5);
  //paraboloid kiri belakang
  LIBS.translateY(HandParaboloid4.MOVE_MATRIX, -1);
  LIBS.translateX(HandParaboloid4.MOVE_MATRIX, 1.625);
  LIBS.scaleX(HandParaboloid4.POSITION_MATRIX, 1.25);
  LIBS.scaleY(HandParaboloid4.POSITION_MATRIX, 25);
  LIBS.scaleZ(HandParaboloid4.POSITION_MATRIX, 1.25);
  LIBS.rotateX(HandParaboloid4.MOVE_MATRIX, -180 * Math.PI / 180);
  //crown paraboloid kiri belakang
  LIBS.scaleX(HandCrown4.POSITION_MATRIX, 0.335);
  LIBS.scaleY(HandCrown4.POSITION_MATRIX, 0.025);
  LIBS.scaleZ(HandCrown4.POSITION_MATRIX, 0.335);
  LIBS.rotateY(HandCrown4.MOVE_MATRIX, 45 * Math.PI / 180);
  LIBS.translateY(HandCrown4.MOVE_MATRIX, -37.75);
  //hand flame kiri belakang
  LIBS.scaleX(HandFlame4.POSITION_MATRIX, 3.5);
  LIBS.scaleY(HandFlame4.POSITION_MATRIX, 1.75);
  LIBS.scaleZ(HandFlame4.POSITION_MATRIX, 3.5);
  LIBS.rotateX(HandFlame4.MOVE_MATRIX, -80 * Math.PI / 180);
  LIBS.rotateY(HandFlame4.MOVE_MATRIX, 45 * Math.PI / 180);
  LIBS.rotateZ(HandFlame4.MOVE_MATRIX, 15 * Math.PI / 180);
  LIBS.translateX(HandFlame4.MOVE_MATRIX, 0.1);
  LIBS.translateZ(HandFlame4.MOVE_MATRIX, 0.1);



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
    // LIBS.rotateZ(HeadFlame1.MOVE_MATRIX, dt * 0.0025);
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
