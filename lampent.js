import { Head } from "./Lampent/Head.js";
import { HatParaboloid } from "./Lampent/HatParaboloid.js";
import { HeadEye } from "./Lampent/HeadEye.js";
import { BodyParaboloid } from "./Lampent/BodyParaboloid.js";
import { BodyClylinder } from "./Lampent/BodyCylinder.js";
import { UnderBodyParaboloid } from "./Lampent/UnderBodyParaboloid.js";
import { BodyBottomCone } from "./Lampent/BodyBottomCone.js";
import { HeadTip } from "./Lampent/HeadTip.js";
import { HeadFlame } from "./Lampent/HeadFlame.js";
import { Hand } from "./Lampent/Hand.js";

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
  var OutHead = new Head(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.05, 0, 0.14, 0.4]);
  var InHead = new Head(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.4, 0.4, 1, 0.05]);
  var HeadFlame1 = new HeadFlame(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadFlame2 = new HeadFlame(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.72, 0.91, 1.0, 1], 0.2, 1.2);
  var HeadTip1 = new HeadTip(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var OutsideHat = new HatParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.075, 0, 0.15]);
  var InsideHat = new HatParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.772, 0.651, 0.992]);
  var HeadEye1 = new HeadEye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var OutlineEye1 = new HeadEye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.05, 0, 0.15], 0.106, 0.009);
  var HeadEye2 = new HeadEye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var OutlineEye2 = new HeadEye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.05, 0, 0.15], 0.106, 0.009);
  var TopBodyParaboloid = new BodyParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var BodyClylinder1 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var Hand1 = new Hand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var Hand2 = new Hand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, 60, 10, 0.5, 0.5);
  var BottomBodyParaboloid = new UnderBodyParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var BodyCone = new BodyBottomCone(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);

  // Child object relationship
  OutHead.childs.push(InHead);
  OutHead.childs.push(HeadFlame1);
  HeadFlame1.childs.push(HeadFlame2);
  InHead.childs.push(OutsideHat);
  OutsideHat.childs.push(InsideHat);
  OutsideHat.childs.push(HeadTip1);
  InHead.childs.push(HeadEye1);
  HeadEye1.childs.push(OutlineEye1);
  InHead.childs.push(HeadEye2);
  HeadEye2.childs.push(OutlineEye2);
  InHead.childs.push(TopBodyParaboloid);
  TopBodyParaboloid.childs.push(BodyClylinder1);
  BodyClylinder1.childs.push(BottomBodyParaboloid);
  BodyClylinder1.childs.push(Hand1);
  BodyClylinder1.childs.push(Hand2);
  BottomBodyParaboloid.childs.push(BodyCone);

  // Scale + Positioning objects
  // Outer Glass (head)
  LIBS.scaleX(OutHead.POSITION_MATRIX, 1);
  LIBS.scaleY(OutHead.POSITION_MATRIX, 1);
  LIBS.scaleZ(OutHead.POSITION_MATRIX, 1);
  LIBS.rotateZ(OutHead.MOVE_MATRIX, 15 * (Math.PI / 180));
  LIBS.translateY(OutHead.POSITION_MATRIX, -5.5);

  // Inner Glass (head inner)
  LIBS.scaleX(InHead.POSITION_MATRIX, 0.95);
  LIBS.scaleY(InHead.POSITION_MATRIX, 0.95);
  LIBS.scaleZ(InHead.POSITION_MATRIX, 0.95);

  // Head flame
  LIBS.rotateX(HeadFlame1.MOVE_MATRIX, -90 * (Math.PI / 180));
  LIBS.rotateY(HeadFlame1.MOVE_MATRIX, -90 * (Math.PI / 180));
  LIBS.translateY(HeadFlame1.POSITION_MATRIX, -0.65);
  LIBS.translateZ(HeadFlame1.POSITION_MATRIX, -0.02);
  LIBS.translateX(HeadFlame1.POSITION_MATRIX, -0.1);

  // Small head flame
  LIBS.scaleX(HeadFlame2.POSITION_MATRIX, 0.45);
  LIBS.scaleY(HeadFlame2.POSITION_MATRIX, 0.45);
  LIBS.scaleZ(HeadFlame2.POSITION_MATRIX, 0.45);
  LIBS.translateY(HeadFlame2.POSITION_MATRIX, 0.08);
  LIBS.translateX(HeadFlame2.POSITION_MATRIX, 0.05);
  LIBS.rotateZ(HeadFlame2.MOVE_MATRIX, 40 * (Math.PI / 180));
  LIBS.rotateX(HeadFlame2.MOVE_MATRIX, 20 * (Math.PI / 180));
  LIBS.rotateY(HeadFlame2.MOVE_MATRIX, 10 * (Math.PI / 180));

  // hat outside
  LIBS.scaleX(OutsideHat.POSITION_MATRIX, 0.25);
  LIBS.scaleY(OutsideHat.POSITION_MATRIX, 0.25);
  LIBS.scaleZ(OutsideHat.POSITION_MATRIX, 0.25);
  LIBS.translateY(OutsideHat.POSITION_MATRIX, 0.1);
  // hat inside
  LIBS.translateY(InsideHat.POSITION_MATRIX, -0.05);

  // head tip
  LIBS.scaleX(HeadTip1.POSITION_MATRIX, 4);
  LIBS.scaleY(HeadTip1.POSITION_MATRIX, 1.5);
  LIBS.scaleZ(HeadTip1.POSITION_MATRIX, 4);
  LIBS.rotateX(HeadTip1.MOVE_MATRIX, -90 * (Math.PI / 180));
  LIBS.translateY(HeadTip1.POSITION_MATRIX, 2.4);

  // head eye (kanan)
  LIBS.translateZ(HeadEye1.POSITION_MATRIX, 0.6);
  LIBS.translateX(HeadEye1.POSITION_MATRIX, 0.347);
  LIBS.translateY(HeadEye1.POSITION_MATRIX, -0.05);
  LIBS.scaleX(HeadEye1.POSITION_MATRIX, 1.1);
  LIBS.scaleY(HeadEye1.POSITION_MATRIX, 1.3);
  LIBS.rotateY(HeadEye1.MOVE_MATRIX, 33 * (Math.PI / 180));
  LIBS.rotateZ(HeadEye1.MOVE_MATRIX, -10 * (Math.PI / 180));

  // head eye (kiri)
  LIBS.translateZ(HeadEye2.POSITION_MATRIX, 0.6);
  LIBS.translateX(HeadEye2.POSITION_MATRIX, -0.347);
  LIBS.translateY(HeadEye2.POSITION_MATRIX, -0.05);
  LIBS.scaleX(HeadEye2.POSITION_MATRIX, 1.1);
  LIBS.scaleY(HeadEye2.POSITION_MATRIX, 1.3);
  LIBS.rotateY(HeadEye2.MOVE_MATRIX, -33 * (Math.PI / 180));
  LIBS.rotateZ(HeadEye2.MOVE_MATRIX, 10 * (Math.PI / 180));

  // body paraboloid
  LIBS.scaleX(TopBodyParaboloid.POSITION_MATRIX, 0.1);
  LIBS.scaleY(TopBodyParaboloid.POSITION_MATRIX, 0.1);
  LIBS.scaleZ(TopBodyParaboloid.POSITION_MATRIX, 0.1);
  LIBS.translateY(TopBodyParaboloid.POSITION_MATRIX, -0.8025);

  // body cylinder
  LIBS.translateY(BodyClylinder1.POSITION_MATRIX, -0.6);
  LIBS.scaleX(BodyClylinder1.POSITION_MATRIX, 25);
  LIBS.scaleY(BodyClylinder1.POSITION_MATRIX, 25);
  LIBS.scaleZ(BodyClylinder1.POSITION_MATRIX, 25);

  // hand kanan
  LIBS.scaleX(Hand1.POSITION_MATRIX, 0.08);
  LIBS.scaleY(Hand1.POSITION_MATRIX, 0.08);
  LIBS.scaleZ(Hand1.POSITION_MATRIX, 0.08);
  LIBS.rotateZ(Hand1.MOVE_MATRIX, 90 * (Math.PI / 180));
  LIBS.rotateX(Hand1.MOVE_MATRIX, 180 * (Math.PI / 180));
  LIBS.translateX(Hand1.POSITION_MATRIX, 0.09);
  LIBS.translateY(Hand1.POSITION_MATRIX, 0.05);

  // hand kiri
  LIBS.scaleX(Hand2.POSITION_MATRIX, 0.08);
  LIBS.scaleY(Hand2.POSITION_MATRIX, 0.08);
  LIBS.scaleZ(Hand2.POSITION_MATRIX, 0.08);
  LIBS.rotateZ(Hand2.MOVE_MATRIX, -90 * (Math.PI / 180));
  LIBS.translateX(Hand2.POSITION_MATRIX, -0.09);
  LIBS.translateY(Hand2.POSITION_MATRIX, 0.05);

  // bottom body paraboloid
  LIBS.scaleX(BottomBodyParaboloid.POSITION_MATRIX, 0.045);
  LIBS.scaleY(BottomBodyParaboloid.POSITION_MATRIX, 0.045);
  LIBS.scaleZ(BottomBodyParaboloid.POSITION_MATRIX, 0.045);
  LIBS.translateY(BottomBodyParaboloid.POSITION_MATRIX, -0.075);

  // body bottom cone
  LIBS.translateY(BodyCone.POSITION_MATRIX, -1.5);

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

  OutHead.setup();

  /*========================= Animation ========================= */
  var time_prev = 0;
  var animate = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    var dt = time - time_prev;
    time_prev = time;

    // =========================
    // SWING ANIMATION using sine wave
    // =========================
    var swingAmplitude = 0.3; // ~17 degrees in radians
    var swingSpeed = 0.0015;
    var swingAngle = swingAmplitude * Math.sin(time * swingSpeed);

    // Reset OutHead matrix and apply swing + base tilt
    OutHead.MOVE_MATRIX = LIBS.get_I4();
    LIBS.rotateZ(OutHead.MOVE_MATRIX, 15 * (Math.PI / 180)); // base tilt ~15 degrees
    LIBS.rotateY(OutHead.MOVE_MATRIX, swingAngle);

    // =========================
    // INFINITY PATH (lemniscate ∞) for OutHead position
    // =========================
    var A = 3.0; // horizontal amplitude
    var B = 2.0; // depth amplitude
    var t = time * 0.001;
    var posX = A * Math.sin(t);
    var posZ = B * Math.sin(t) * Math.cos(t);
    var posY = 4.5 + 0.5 * Math.sin(t * 2);

    LIBS.translateX(OutHead.MOVE_MATRIX, posX);
    LIBS.translateZ(OutHead.MOVE_MATRIX, posZ);
    LIBS.translateY(OutHead.MOVE_MATRIX, posY);

    // =========================
    // HAND ROTATION ANIMATION using sine wave
    // =========================
    var armAmplitude = 0.4; // radians (~23 degrees)
    var armSpeed = 0.002;
    var armAngle = armAmplitude * Math.sin(time * armSpeed);

    // Right Hand
    Hand1.MOVE_MATRIX = LIBS.get_I4();
    LIBS.rotateZ(Hand1.MOVE_MATRIX, 90 * (Math.PI / 180) + armAngle);
    LIBS.rotateX(Hand1.MOVE_MATRIX, 180 * (Math.PI / 180));

    // Left Hand (opposite direction)
    Hand2.MOVE_MATRIX = LIBS.get_I4();
    LIBS.rotateZ(Hand2.MOVE_MATRIX, -90 * (Math.PI / 180) + armAngle);

    // =========================
    // CAMERA CONTROL (mouse rotation)
    // =========================
    var cam = LIBS.get_I4();
    LIBS.translateZ(cam, -12);
    LIBS.rotateX(cam, PHI);
    LIBS.rotateY(cam, THETA);

    GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
    GL.uniformMatrix4fv(_Vmatrix, false, cam);

    // =========================
    // RENDER SCENE
    // =========================
    GL.depthMask(true);
    InHead.childs.forEach((child) => child.render(LIBS.multiply(OutHead.MOVE_MATRIX, OutHead.POSITION_MATRIX)));

    GL.depthMask(false);
    renderHeadOnly(OutHead, LIBS.get_I4());

    GL.flush();
    window.requestAnimationFrame(animate);
  };

  // render Head only untuk efek transparansi kaca
  function renderHeadOnly(obj, PARENT_MATRIX) {
    obj.MODEL_MATRIX = LIBS.multiply(obj.MOVE_MATRIX, obj.POSITION_MATRIX);
    obj.MODEL_MATRIX = LIBS.multiply(obj.MODEL_MATRIX, PARENT_MATRIX);

    GL.useProgram(SHADER_PROGRAM);
    GL.uniformMatrix4fv(_Mmatrix, false, obj.MODEL_MATRIX);

    GL.bindBuffer(GL.ARRAY_BUFFER, obj.OBJECT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 28, 0);
    GL.vertexAttribPointer(_color, 4, GL.FLOAT, false, 28, 12);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, obj.OBJECT_FACES);
    GL.drawElements(GL.TRIANGLES, obj.faces.length, GL.UNSIGNED_SHORT, 0);

    // If this is InHead, stop recursion and don't render its children
    if (obj === InHead) {
      return;
    }

    // Otherwise, continue rendering children recursively
    obj.childs.forEach((child) => {
      renderHeadOnly(child, obj.MODEL_MATRIX);
    });
  }
  animate(0);
}
window.addEventListener("load", main);
