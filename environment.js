// Litwick
import { LitwickHead } from "./Litwick/Head.js";
import { BodyClylinder } from "./Litwick/Feet.js";
import { HeadTip } from "./Litwick/HeadFlame.js";
import { LitwickHeadEye } from "./Litwick/HeadEye.js";
import { Hair } from "./Litwick/Hair.js";
import { NoseHand } from "./Litwick/NoseOrHandParaboloid.js";
import { Scalp } from "./Litwick/Scalp.js";

// Lampent
import { LampentHead } from "./Lampent/Head.js";
import { LampentHatParaboloid } from "./Lampent/HatParaboloid.js";
import { LampentHeadEye } from "./Lampent/HeadEye.js";
import { LampentBodyParaboloid } from "./Lampent/BodyParaboloid.js";
import { LampentBodyClylinder } from "./Lampent/BodyCylinder.js";
import { LampentUnderBodyParaboloid } from "./Lampent/UnderBodyParaboloid.js";
import { LampentBodyBottomCone } from "./Lampent/BodyBottomCone.js";
import { LampentHeadTip } from "./Lampent/HeadTip.js";
import { LampentHeadFlame } from "./Lampent/HeadFlame.js";
import { LampentHand } from "./Lampent/Hand.js";

// Chandelure
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
import { GravestoneA } from "./Environment/Grave1.js";
import { DirtGrassLand } from "./Environment/Grass.js";
import { GraveArch } from "./Environment/GraveyardArch.js";

// Environment
import { Fence } from "./Environment/Fence.js";
import { OutwardDirt } from "./Environment/OutDirt.js";
import { CandleBody } from "./Environment/CandleBody.js";
import { CandleFlame } from "./Environment/CandleFlame.js";
import { StoneBorder } from "./Environment/StoneBorder.js";
import { Mountain } from "./Environment/Mountain.js";
import { CrossGravestone } from "./Environment/Grave2.js";
import { NonSymmetricalBoxGrave } from "./Environment/Grave3.js";
import { DeadTree } from "./Environment/Tree.js";

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

  // TODO: Litwick Model
  var LitwickHead1 = new LitwickHead(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var Nose = new NoseHand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var Left_hand = new NoseHand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var Right_hand = new NoseHand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);

  var hair = new Hair(
    GL,
    SHADER_PROGRAM,
    _position,
    _color,
    _Mmatrix,
    0.7, // radius
    0.8, // height
    32, // segments
    [0.9, 0.91, 0.91], // gradient color
    [0.9, 0.91, 0.91] // color
  );
  var hair2 = new Hair(
    GL,
    SHADER_PROGRAM,
    _position,
    _color,
    _Mmatrix,
    0.7, // radius
    0.8, // height
    32, // segments
    [0.9, 0.91, 0.91], // gradient color
    [0.9, 0.91, 0.91] // color
  );
  var hair3 = new Hair(
    GL,
    SHADER_PROGRAM,
    _position,
    _color,
    _Mmatrix,
    0.7, // radius
    0.8, // height
    32, // segments
    [0.9, 0.91, 0.91], // gradient color
    [0.9, 0.91, 0.91] // color
  );
  var LitwickBodyClylinder1 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var Eyes = new LitwickHeadEye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var feet1 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var feet2 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var feet3 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var feet4 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var feet5 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var feet6 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var feet7 = new BodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var LitwickHeadTip1 = new HeadTip(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var scalp = new Scalp(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  // Child object relationship
  LitwickBodyClylinder1.childs.push(
    LitwickHead1,
    Eyes,
    feet1,
    feet2,
    feet3,
    feet4,
    feet5,
    feet6,
    feet7,
    LitwickHeadTip1,
    Nose,
    Left_hand,
    Right_hand,
    hair,
    hair2,
    hair3,
    scalp
  );

  // ====== Hair / Wax positioning ======
  // Middle hair
  LIBS.translateX(hair.POSITION_MATRIX, -0);
  LIBS.translateY(hair.POSITION_MATRIX, 0.28);
  LIBS.translateZ(hair.POSITION_MATRIX, 0);
  LIBS.scaleX(hair.POSITION_MATRIX, 0.3);
  LIBS.scaleY(hair.POSITION_MATRIX, 0.4);
  LIBS.scaleZ(hair.POSITION_MATRIX, 0.45);
  LIBS.rotateX(hair.POSITION_MATRIX, Math.PI);

  // Left-side hair
  LIBS.translateX(hair2.POSITION_MATRIX, 0.07);
  LIBS.translateY(hair2.POSITION_MATRIX, 0.28);
  LIBS.translateZ(hair2.POSITION_MATRIX, 0);
  LIBS.scaleX(hair2.POSITION_MATRIX, 0.4);
  LIBS.scaleY(hair2.POSITION_MATRIX, 0.4);
  LIBS.scaleZ(hair2.POSITION_MATRIX, 0.35);
  LIBS.rotateX(hair2.POSITION_MATRIX, Math.PI);

  // Right-side hair
  LIBS.translateX(hair3.POSITION_MATRIX, -0.07);
  LIBS.translateY(hair3.POSITION_MATRIX, 0.24);
  LIBS.translateZ(hair3.POSITION_MATRIX, 0);
  LIBS.scaleX(hair3.POSITION_MATRIX, 0.4);
  LIBS.scaleY(hair3.POSITION_MATRIX, 0.5);
  LIBS.scaleZ(hair3.POSITION_MATRIX, 0.4);

  LIBS.rotateX(hair3.POSITION_MATRIX, Math.PI);

  // feet1 front-left
  LIBS.translateZ(feet1.POSITION_MATRIX, 0.1);
  LIBS.translateY(feet1.POSITION_MATRIX, -0.2);
  LIBS.translateX(feet1.POSITION_MATRIX, 0.15);
  LIBS.scaleX(feet1.POSITION_MATRIX, 1.5);
  LIBS.scaleZ(feet1.POSITION_MATRIX, 1.5);
  LIBS.scaleY(feet1.POSITION_MATRIX, 0.3);

  // feet2 front-right
  LIBS.translateZ(feet2.POSITION_MATRIX, 0.1);
  LIBS.translateY(feet2.POSITION_MATRIX, -0.2);
  LIBS.translateX(feet2.POSITION_MATRIX, -0.15);
  LIBS.scaleX(feet2.POSITION_MATRIX, 1.5);
  LIBS.scaleZ(feet2.POSITION_MATRIX, 1.5);
  LIBS.scaleY(feet2.POSITION_MATRIX, 0.3);

  // feet3 front-middle
  LIBS.translateY(feet3.POSITION_MATRIX, -0.2);
  LIBS.translateZ(feet3.POSITION_MATRIX, 0.2);
  LIBS.scaleX(feet3.POSITION_MATRIX, 1.5);
  LIBS.scaleZ(feet3.POSITION_MATRIX, 1.5);
  LIBS.scaleY(feet3.POSITION_MATRIX, 0.3);

  // feet4 middle-right
  LIBS.translateZ(feet4.POSITION_MATRIX, 0);
  LIBS.translateY(feet4.POSITION_MATRIX, -0.2);
  LIBS.translateX(feet4.POSITION_MATRIX, 0.15);
  LIBS.scaleX(feet4.POSITION_MATRIX, 1.5);
  LIBS.scaleZ(feet4.POSITION_MATRIX, 1.5);
  LIBS.scaleY(feet4.POSITION_MATRIX, 0.3);

  // feet5 middle-middle
  LIBS.translateY(feet5.POSITION_MATRIX, -0.2);
  LIBS.translateZ(feet5.POSITION_MATRIX, 0);
  LIBS.scaleY(feet5.POSITION_MATRIX, 0.3);
  LIBS.scaleZ(feet5.POSITION_MATRIX, 2);
  LIBS.scaleX(feet5.POSITION_MATRIX, 2);

  // feet6 middle-left
  LIBS.translateZ(feet6.POSITION_MATRIX, 0);
  LIBS.translateY(feet6.POSITION_MATRIX, -0.2);
  LIBS.translateX(feet6.POSITION_MATRIX, -0.15);
  LIBS.scaleX(feet6.POSITION_MATRIX, 1.5);
  LIBS.scaleZ(feet6.POSITION_MATRIX, 1.5);
  LIBS.scaleY(feet6.POSITION_MATRIX, 0.3);

  // feet7 back the big one
  LIBS.translateZ(feet7.POSITION_MATRIX, -0.1);
  LIBS.translateY(feet7.POSITION_MATRIX, -0.2);
  LIBS.scaleY(feet7.POSITION_MATRIX, 0.3);
  LIBS.scaleZ(feet7.POSITION_MATRIX, 2);
  LIBS.scaleX(feet7.POSITION_MATRIX, 2);

  // object1 (head)
  LIBS.scaleX(LitwickHead1.POSITION_MATRIX, 0.5);
  LIBS.scaleY(LitwickHead1.POSITION_MATRIX, 0.45);
  LIBS.scaleZ(LitwickHead1.POSITION_MATRIX, 0.5);
  LIBS.rotateX(LitwickHead1.MOVE_MATRIX, 3.15);

  // eye left
  LIBS.translateX(Eyes.POSITION_MATRIX, 0.2);
  LIBS.translateZ(Eyes.POSITION_MATRIX, 0.25);
  LIBS.translateY(Eyes.POSITION_MATRIX, 0.09);
  LIBS.scaleX(Eyes.POSITION_MATRIX, 0.3);
  LIBS.scaleY(Eyes.POSITION_MATRIX, 0.7);
  LIBS.rotateX(Eyes.MOVE_MATRIX, 0.25);
  LIBS.rotateY(Eyes.MOVE_MATRIX, 0.25);

  // head tip
  LIBS.scaleX(LitwickHeadTip1.POSITION_MATRIX, 0.6);
  LIBS.scaleY(LitwickHeadTip1.POSITION_MATRIX, 0.2);
  LIBS.scaleZ(LitwickHeadTip1.POSITION_MATRIX, 0.6);
  LIBS.rotateX(LitwickHeadTip1.MOVE_MATRIX, -90 * (Math.PI / 180));
  LIBS.translateY(LitwickHeadTip1.POSITION_MATRIX, 0.5);

  // scalp
  LIBS.scaleX(scalp.POSITION_MATRIX, 0.55);
  LIBS.scaleY(scalp.POSITION_MATRIX, 0.3);
  LIBS.scaleZ(scalp.POSITION_MATRIX, 0.5);
  LIBS.translateY(scalp.POSITION_MATRIX, 0.4075);
  LIBS.rotateX(scalp.MOVE_MATRIX, 3.15);

  // nose
  LIBS.scaleX(Nose.POSITION_MATRIX, 0.15);
  LIBS.scaleY(Nose.POSITION_MATRIX, 3);
  LIBS.scaleZ(Nose.POSITION_MATRIX, 0.1);
  LIBS.translateZ(Nose.POSITION_MATRIX, -2.5);
  LIBS.translateY(Nose.POSITION_MATRIX, 0.85);
  LIBS.rotateX(Nose.POSITION_MATRIX, 5);

  // left hand
  LIBS.scaleX(Left_hand.POSITION_MATRIX, 0.1);
  LIBS.scaleY(Left_hand.POSITION_MATRIX, 3);
  LIBS.scaleZ(Left_hand.POSITION_MATRIX, 0.1);
  LIBS.translateX(Left_hand.POSITION_MATRIX, -1.8);
  LIBS.translateY(Left_hand.POSITION_MATRIX, 2);
  LIBS.rotateZ(Left_hand.POSITION_MATRIX, -5.5);

  // right hand
  LIBS.scaleX(Right_hand.POSITION_MATRIX, 0.1);
  LIBS.scaleY(Right_hand.POSITION_MATRIX, 3);
  LIBS.scaleZ(Right_hand.POSITION_MATRIX, 0.1);
  LIBS.translateX(Right_hand.POSITION_MATRIX, 1.8);
  LIBS.translateY(Right_hand.POSITION_MATRIX, 2);
  LIBS.rotateZ(Right_hand.POSITION_MATRIX, 5.5);

  // body cylinder
  LIBS.translateY(LitwickBodyClylinder1.POSITION_MATRIX, -3.8);
  LIBS.translateX(LitwickBodyClylinder1.POSITION_MATRIX, -4);
  LIBS.translateZ(LitwickBodyClylinder1.POSITION_MATRIX, 15);
  LIBS.rotateY(LitwickBodyClylinder1.MOVE_MATRIX, 40 * (Math.PI / 180));
  LIBS.scaleX(LitwickBodyClylinder1.POSITION_MATRIX, 1);
  LIBS.scaleY(LitwickBodyClylinder1.POSITION_MATRIX, 1);
  LIBS.scaleZ(LitwickBodyClylinder1.POSITION_MATRIX, 1);

  // TODO: Lampent Model
  var OutHead = new LampentHead(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.05, 0, 0.14, 0.4]);
  var InHead = new LampentHead(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.4, 0.4, 1, 0.6]);
  var HeadFire1 = new LampentHeadFlame(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var HeadFire2 = new LampentHeadFlame(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.72, 0.91, 1.0, 1], 0.2, 1.2);
  var HeadTip1 = new LampentHeadTip(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var OutsideHat = new LampentHatParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.075, 0, 0.15]);
  var InsideHat = new LampentHatParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.772, 0.651, 0.992]);
  var Eye1 = new LampentHeadEye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var OutlineEye1 = new LampentHeadEye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.05, 0, 0.15], 0.106, 0.009);
  var Eye2 = new LampentHeadEye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var OutlineEye2 = new LampentHeadEye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, [0.05, 0, 0.15], 0.106, 0.009);
  var TopBodyParaboloid = new LampentBodyParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var BodyClylinder1 = new LampentBodyClylinder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var LampentHand1 = new LampentHand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var LampentHand2 = new LampentHand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, 60, 10, 0.5, 0.5);
  var BottomBodyParaboloid = new LampentUnderBodyParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var LampentBodyCone = new LampentBodyBottomCone(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);

  // Child object relationship
  OutHead.childs.push(InHead);
  OutHead.childs.push(HeadFire1);
  HeadFire1.childs.push(HeadFire2);
  InHead.childs.push(OutsideHat);
  OutsideHat.childs.push(InsideHat);
  OutsideHat.childs.push(HeadTip1);
  InHead.childs.push(Eye1);
  Eye1.childs.push(OutlineEye1);
  InHead.childs.push(Eye2);
  Eye2.childs.push(OutlineEye2);
  InHead.childs.push(TopBodyParaboloid);
  TopBodyParaboloid.childs.push(BodyClylinder1);
  BodyClylinder1.childs.push(BottomBodyParaboloid);
  BodyClylinder1.childs.push(LampentHand1);
  BodyClylinder1.childs.push(LampentHand2);
  BottomBodyParaboloid.childs.push(LampentBodyCone);

  // Scale + Positioning objects
  // Outer Glass (head)
  LIBS.scaleX(OutHead.POSITION_MATRIX, 0.5);
  LIBS.scaleY(OutHead.POSITION_MATRIX, 0.5);
  LIBS.scaleZ(OutHead.POSITION_MATRIX, 0.5);
  LIBS.rotateY(OutHead.POSITION_MATRIX, 100 * (Math.PI / 180));
  LIBS.translateY(OutHead.POSITION_MATRIX, -2);
  LIBS.translateZ(OutHead.POSITION_MATRIX, 0);
  LIBS.translateX(OutHead.POSITION_MATRIX, -10);

  // Inner Glass (head inner)
  LIBS.scaleX(InHead.POSITION_MATRIX, 0.95);
  LIBS.scaleY(InHead.POSITION_MATRIX, 0.95);
  LIBS.scaleZ(InHead.POSITION_MATRIX, 0.95);

  // Head flame
  LIBS.rotateX(HeadFire1.MOVE_MATRIX, -90 * (Math.PI / 180));
  LIBS.rotateY(HeadFire1.MOVE_MATRIX, -90 * (Math.PI / 180));
  LIBS.translateY(HeadFire1.POSITION_MATRIX, -0.65);
  LIBS.translateZ(HeadFire1.POSITION_MATRIX, -0.02);
  LIBS.translateX(HeadFire1.POSITION_MATRIX, -0.1);

  // Small head flame
  LIBS.scaleX(HeadFire2.POSITION_MATRIX, 0.45);
  LIBS.scaleY(HeadFire2.POSITION_MATRIX, 0.45);
  LIBS.scaleZ(HeadFire2.POSITION_MATRIX, 0.45);
  LIBS.translateY(HeadFire2.POSITION_MATRIX, 0.08);
  LIBS.translateX(HeadFire2.POSITION_MATRIX, 0.05);
  LIBS.rotateZ(HeadFire2.MOVE_MATRIX, 40 * (Math.PI / 180));
  LIBS.rotateX(HeadFire2.MOVE_MATRIX, 20 * (Math.PI / 180));
  LIBS.rotateY(HeadFire2.MOVE_MATRIX, 10 * (Math.PI / 180));

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
  LIBS.translateZ(Eye1.POSITION_MATRIX, 0.6);
  LIBS.translateX(Eye1.POSITION_MATRIX, 0.347);
  LIBS.translateY(Eye1.POSITION_MATRIX, -0.05);
  LIBS.scaleX(Eye1.POSITION_MATRIX, 1.1);
  LIBS.scaleY(Eye1.POSITION_MATRIX, 1.3);
  LIBS.rotateY(Eye1.MOVE_MATRIX, 33 * (Math.PI / 180));
  LIBS.rotateZ(Eye1.MOVE_MATRIX, -10 * (Math.PI / 180));

  // head eye (kiri)
  LIBS.translateZ(Eye2.POSITION_MATRIX, 0.6);
  LIBS.translateX(Eye2.POSITION_MATRIX, -0.347);
  LIBS.translateY(Eye2.POSITION_MATRIX, -0.05);
  LIBS.scaleX(Eye2.POSITION_MATRIX, 1.1);
  LIBS.scaleY(Eye2.POSITION_MATRIX, 1.3);
  LIBS.rotateY(Eye2.MOVE_MATRIX, -33 * (Math.PI / 180));
  LIBS.rotateZ(Eye2.MOVE_MATRIX, 10 * (Math.PI / 180));

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
  LIBS.scaleX(LampentHand1.POSITION_MATRIX, 0.08);
  LIBS.scaleY(LampentHand1.POSITION_MATRIX, 0.08);
  LIBS.scaleZ(LampentHand1.POSITION_MATRIX, 0.08);
  LIBS.rotateZ(LampentHand1.MOVE_MATRIX, 90 * (Math.PI / 180));
  LIBS.translateX(LampentHand1.POSITION_MATRIX, 0.09);
  LIBS.translateY(LampentHand1.POSITION_MATRIX, 0.05);

  // hand kiri
  LIBS.scaleX(LampentHand2.POSITION_MATRIX, 0.08);
  LIBS.scaleY(LampentHand2.POSITION_MATRIX, 0.08);
  LIBS.scaleZ(LampentHand2.POSITION_MATRIX, 0.08);
  LIBS.rotateZ(LampentHand2.MOVE_MATRIX, -90 * (Math.PI / 180));
  LIBS.translateX(LampentHand2.POSITION_MATRIX, -0.09);
  LIBS.translateY(LampentHand2.POSITION_MATRIX, 0.05);

  // bottom body paraboloid
  LIBS.scaleX(BottomBodyParaboloid.POSITION_MATRIX, 0.045);
  LIBS.scaleY(BottomBodyParaboloid.POSITION_MATRIX, 0.045);
  LIBS.scaleZ(BottomBodyParaboloid.POSITION_MATRIX, 0.045);
  LIBS.translateY(BottomBodyParaboloid.POSITION_MATRIX, -0.075);

  // body bottom cone
  LIBS.translateY(LampentBodyCone.POSITION_MATRIX, -1.5);

  // TODO: Chandelure Model
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

  var Land = new DirtGrassLand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var Land2 = new DirtGrassLand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var Land3 = new DirtGrassLand(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var GraveArch1 = new GraveArch(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);

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

  Land.childs.push(Land2);
  Land.childs.push(Land3);
  Land.childs.push(GraveArch1);
  Land.childs.push(Object1);

  LIBS.translateZ(Land2.MOVE_MATRIX, 20);
  LIBS.translateY(Land2.MOVE_MATRIX, -1.7);

  LIBS.translateZ(Land3.MOVE_MATRIX, -23);
  LIBS.translateY(Land3.MOVE_MATRIX, 1.7);

  // Scale + Positioning objects
  //object1 (head)
  LIBS.scaleX(Object1.POSITION_MATRIX, 2.3);
  LIBS.scaleY(Object1.POSITION_MATRIX, 2.3);
  LIBS.scaleZ(Object1.POSITION_MATRIX, 2.3);
  LIBS.translateZ(Object1.POSITION_MATRIX, -18);
  LIBS.translateY(Object1.POSITION_MATRIX, 6);
  LIBS.translateX(Object1.POSITION_MATRIX, 5);

  //eye kanan
  LIBS.rotateY(HeadEye1.MOVE_MATRIX, (90 * Math.PI) / 180);
  LIBS.rotateZ(HeadEye1.MOVE_MATRIX, (-45 * Math.PI) / 180);
  LIBS.translateY(HeadEye1.MOVE_MATRIX, 0.381);
  LIBS.translateX(HeadEye1.MOVE_MATRIX, -0.37);
  //eye kiri
  LIBS.rotateY(HeadEye2.MOVE_MATRIX, (90 * Math.PI) / 180);
  LIBS.rotateZ(HeadEye2.MOVE_MATRIX, (45 * Math.PI) / 180);
  LIBS.translateY(HeadEye2.MOVE_MATRIX, -0.381);
  LIBS.translateX(HeadEye2.MOVE_MATRIX, -0.37);
  //head crown
  LIBS.scaleX(HeadCrown1.POSITION_MATRIX, 0.15);
  LIBS.scaleY(HeadCrown1.POSITION_MATRIX, 0.15);
  LIBS.scaleZ(HeadCrown1.POSITION_MATRIX, 0.15);
  LIBS.rotateX(HeadCrown1.MOVE_MATRIX, (-90 * Math.PI) / 180);
  LIBS.translateZ(HeadCrown1.MOVE_MATRIX, -3);
  //head flame
  LIBS.scaleX(HeadFlame1.POSITION_MATRIX, 0.6);
  LIBS.scaleY(HeadFlame1.POSITION_MATRIX, 0.6);
  // LIBS.scaleZ(HeadFlame1.POSITION_MATRIX, 0.5);
  LIBS.rotateX(HeadFlame1.POSITION_MATRIX, (180 * Math.PI) / 180);
  LIBS.rotateZ(HeadFlame1.POSITION_MATRIX, (90 * Math.PI) / 180);
  LIBS.translateX(HeadFlame1.MOVE_MATRIX, -0.05);
  LIBS.translateY(HeadFlame1.MOVE_MATRIX, -0.2);
  LIBS.translateZ(HeadFlame1.MOVE_MATRIX, 0.4);
  //object2 (body paraboloid)
  LIBS.scaleX(Object2.POSITION_MATRIX, 0.1);
  LIBS.scaleY(Object2.POSITION_MATRIX, 0.1);
  LIBS.scaleZ(Object2.POSITION_MATRIX, 0.1);
  LIBS.rotateX(Object2.MOVE_MATRIX, (-90 * Math.PI) / 180);
  LIBS.translateZ(Object2.MOVE_MATRIX, 4.325);
  //hand kanan
  LIBS.scaleX(Hand1.POSITION_MATRIX, 0.35);
  LIBS.scaleY(Hand1.POSITION_MATRIX, 0.35);
  LIBS.scaleZ(Hand1.POSITION_MATRIX, 0.35);
  LIBS.rotateX(Hand1.MOVE_MATRIX, (90 * Math.PI) / 180);
  LIBS.rotateY(Hand1.MOVE_MATRIX, (-50 * Math.PI) / 180);
  LIBS.rotateZ(Hand1.MOVE_MATRIX, (-90 * Math.PI) / 180);
  LIBS.translateY(Hand1.MOVE_MATRIX, 13);
  LIBS.translateZ(Hand1.MOVE_MATRIX, 26);
  //hand kiri
  LIBS.scaleX(Hand2.POSITION_MATRIX, 0.35);
  LIBS.scaleY(Hand2.POSITION_MATRIX, 0.35);
  LIBS.scaleZ(Hand2.POSITION_MATRIX, 0.35);
  LIBS.rotateX(Hand2.MOVE_MATRIX, (-90 * Math.PI) / 180);
  LIBS.rotateY(Hand2.MOVE_MATRIX, (50 * Math.PI) / 180);
  LIBS.rotateZ(Hand2.MOVE_MATRIX, (-90 * Math.PI) / 180);
  LIBS.translateY(Hand2.MOVE_MATRIX, 13);
  LIBS.translateZ(Hand2.MOVE_MATRIX, -26);
  //subhand kanan depan
  LIBS.scaleX(SubHand1.POSITION_MATRIX, 6);
  LIBS.scaleY(SubHand1.POSITION_MATRIX, 6);
  LIBS.scaleZ(SubHand1.POSITION_MATRIX, 6);
  LIBS.rotateX(SubHand1.MOVE_MATRIX, (-220 * Math.PI) / 180);
  LIBS.rotateY(SubHand1.MOVE_MATRIX, (-90 * Math.PI) / 180);
  LIBS.rotateZ(SubHand1.MOVE_MATRIX, (80 * Math.PI) / 180);
  LIBS.translateX(SubHand1.MOVE_MATRIX, 0.9);
  LIBS.translateY(SubHand1.MOVE_MATRIX, 1.5);
  // LIBS.translateZ(SubHand1.MOVE_MATRIX, -0.5);
  //paraboloid kanan depan
  LIBS.translateY(HandParaboloid1.MOVE_MATRIX, -1);
  LIBS.translateX(HandParaboloid1.MOVE_MATRIX, 1.625);
  LIBS.scaleX(HandParaboloid1.POSITION_MATRIX, 1.25);
  LIBS.scaleY(HandParaboloid1.POSITION_MATRIX, 25);
  LIBS.scaleZ(HandParaboloid1.POSITION_MATRIX, 1.25);
  LIBS.rotateX(HandParaboloid1.MOVE_MATRIX, (-180 * Math.PI) / 180);
  //crown paraboloid kanan depan
  LIBS.scaleX(HandCrown1.POSITION_MATRIX, 0.335);
  LIBS.scaleY(HandCrown1.POSITION_MATRIX, 0.025);
  LIBS.scaleZ(HandCrown1.POSITION_MATRIX, 0.335);
  LIBS.rotateY(HandCrown1.MOVE_MATRIX, (45 * Math.PI) / 180);
  LIBS.translateY(HandCrown1.MOVE_MATRIX, -37.75);
  //body paraboloid1
  LIBS.translateY(BodyParaboloid1.MOVE_MATRIX, -1.8);
  //hand flame kanan depan
  LIBS.scaleX(HandFlame1.POSITION_MATRIX, 3.5);
  LIBS.scaleY(HandFlame1.POSITION_MATRIX, 1.75);
  LIBS.scaleZ(HandFlame1.POSITION_MATRIX, 3.5);
  LIBS.rotateX(HandFlame1.MOVE_MATRIX, (-80 * Math.PI) / 180);
  LIBS.rotateY(HandFlame1.MOVE_MATRIX, (45 * Math.PI) / 180);
  LIBS.rotateZ(HandFlame1.MOVE_MATRIX, (15 * Math.PI) / 180);
  LIBS.translateX(HandFlame1.MOVE_MATRIX, 0.1);
  LIBS.translateZ(HandFlame1.MOVE_MATRIX, 0.1);
  //subhand kanan belakang
  LIBS.scaleX(SubHand2.POSITION_MATRIX, 6);
  LIBS.scaleY(SubHand2.POSITION_MATRIX, 6);
  LIBS.scaleZ(SubHand2.POSITION_MATRIX, 6);
  LIBS.rotateX(SubHand2.MOVE_MATRIX, (220 * Math.PI) / 180);
  LIBS.rotateY(SubHand2.MOVE_MATRIX, (90 * Math.PI) / 180);
  LIBS.rotateZ(SubHand2.MOVE_MATRIX, (80 * Math.PI) / 180);
  LIBS.translateX(SubHand2.MOVE_MATRIX, 0.9);
  LIBS.translateY(SubHand2.MOVE_MATRIX, 1.5);
  //paraboloid kanan belakang
  LIBS.translateY(HandParaboloid2.MOVE_MATRIX, -1);
  LIBS.translateX(HandParaboloid2.MOVE_MATRIX, 1.625);
  LIBS.scaleX(HandParaboloid2.POSITION_MATRIX, 1.25);
  LIBS.scaleY(HandParaboloid2.POSITION_MATRIX, 25);
  LIBS.scaleZ(HandParaboloid2.POSITION_MATRIX, 1.25);
  LIBS.rotateX(HandParaboloid2.MOVE_MATRIX, (-180 * Math.PI) / 180);
  //crown paraboloid kanan belakang
  LIBS.scaleX(HandCrown2.POSITION_MATRIX, 0.335);
  LIBS.scaleY(HandCrown2.POSITION_MATRIX, 0.025);
  LIBS.scaleZ(HandCrown2.POSITION_MATRIX, 0.335);
  LIBS.rotateY(HandCrown2.MOVE_MATRIX, (45 * Math.PI) / 180);
  LIBS.translateY(HandCrown2.MOVE_MATRIX, -37.75);
  //hand flame kanan belakang
  LIBS.scaleX(HandFlame2.POSITION_MATRIX, 3.5);
  LIBS.scaleY(HandFlame2.POSITION_MATRIX, 1.75);
  LIBS.scaleZ(HandFlame2.POSITION_MATRIX, 3.5);
  LIBS.rotateX(HandFlame2.MOVE_MATRIX, (-80 * Math.PI) / 180);
  LIBS.rotateY(HandFlame2.MOVE_MATRIX, (225 * Math.PI) / 180);
  LIBS.rotateZ(HandFlame2.MOVE_MATRIX, (-15 * Math.PI) / 180);
  LIBS.translateX(HandFlame2.MOVE_MATRIX, -0.1);
  LIBS.translateZ(HandFlame2.MOVE_MATRIX, -0.1);
  //subhand kiri depan
  LIBS.scaleX(SubHand3.POSITION_MATRIX, 6);
  LIBS.scaleY(SubHand3.POSITION_MATRIX, 6);
  LIBS.scaleZ(SubHand3.POSITION_MATRIX, 6);
  LIBS.rotateX(SubHand3.MOVE_MATRIX, (220 * Math.PI) / 180);
  LIBS.rotateY(SubHand3.MOVE_MATRIX, (90 * Math.PI) / 180);
  LIBS.rotateZ(SubHand3.MOVE_MATRIX, (80 * Math.PI) / 180);
  LIBS.translateX(SubHand3.MOVE_MATRIX, 0.9);
  LIBS.translateY(SubHand3.MOVE_MATRIX, 1.5);
  //paraboloid kiri depan
  LIBS.translateY(HandParaboloid3.MOVE_MATRIX, -1);
  LIBS.translateX(HandParaboloid3.MOVE_MATRIX, 1.625);
  LIBS.scaleX(HandParaboloid3.POSITION_MATRIX, 1.25);
  LIBS.scaleY(HandParaboloid3.POSITION_MATRIX, 25);
  LIBS.scaleZ(HandParaboloid3.POSITION_MATRIX, 1.25);
  LIBS.rotateX(HandParaboloid3.MOVE_MATRIX, (-180 * Math.PI) / 180);
  //crown paraboloid kiri depan
  LIBS.scaleX(HandCrown3.POSITION_MATRIX, 0.335);
  LIBS.scaleY(HandCrown3.POSITION_MATRIX, 0.025);
  LIBS.scaleZ(HandCrown3.POSITION_MATRIX, 0.335);
  LIBS.rotateY(HandCrown3.MOVE_MATRIX, (45 * Math.PI) / 180);
  LIBS.translateY(HandCrown3.MOVE_MATRIX, -37.75);
  //hand flame kiri depan
  LIBS.scaleX(HandFlame3.POSITION_MATRIX, 3.5);
  LIBS.scaleY(HandFlame3.POSITION_MATRIX, 1.75);
  LIBS.scaleZ(HandFlame3.POSITION_MATRIX, 3.5);
  LIBS.rotateX(HandFlame3.MOVE_MATRIX, (-80 * Math.PI) / 180);
  LIBS.rotateY(HandFlame3.MOVE_MATRIX, (225 * Math.PI) / 180);
  LIBS.rotateZ(HandFlame3.MOVE_MATRIX, (-15 * Math.PI) / 180);
  LIBS.translateX(HandFlame3.MOVE_MATRIX, -0.1);
  LIBS.translateZ(HandFlame3.MOVE_MATRIX, -0.1);
  //subhand kiri belakang
  LIBS.scaleX(SubHand4.POSITION_MATRIX, 6);
  LIBS.scaleY(SubHand4.POSITION_MATRIX, 6);
  LIBS.scaleZ(SubHand4.POSITION_MATRIX, 6);
  LIBS.rotateX(SubHand4.MOVE_MATRIX, (-220 * Math.PI) / 180);
  LIBS.rotateY(SubHand4.MOVE_MATRIX, (-90 * Math.PI) / 180);
  LIBS.rotateZ(SubHand4.MOVE_MATRIX, (80 * Math.PI) / 180);
  LIBS.translateX(SubHand4.MOVE_MATRIX, 0.9);
  LIBS.translateY(SubHand4.MOVE_MATRIX, 1.5);
  //paraboloid kiri belakang
  LIBS.translateY(HandParaboloid4.MOVE_MATRIX, -1);
  LIBS.translateX(HandParaboloid4.MOVE_MATRIX, 1.625);
  LIBS.scaleX(HandParaboloid4.POSITION_MATRIX, 1.25);
  LIBS.scaleY(HandParaboloid4.POSITION_MATRIX, 25);
  LIBS.scaleZ(HandParaboloid4.POSITION_MATRIX, 1.25);
  LIBS.rotateX(HandParaboloid4.MOVE_MATRIX, (-180 * Math.PI) / 180);
  //crown paraboloid kiri belakang
  LIBS.scaleX(HandCrown4.POSITION_MATRIX, 0.335);
  LIBS.scaleY(HandCrown4.POSITION_MATRIX, 0.025);
  LIBS.scaleZ(HandCrown4.POSITION_MATRIX, 0.335);
  LIBS.rotateY(HandCrown4.MOVE_MATRIX, (45 * Math.PI) / 180);
  LIBS.translateY(HandCrown4.MOVE_MATRIX, -37.75);
  //hand flame kiri belakang
  LIBS.scaleX(HandFlame4.POSITION_MATRIX, 3.5);
  LIBS.scaleY(HandFlame4.POSITION_MATRIX, 1.75);
  LIBS.scaleZ(HandFlame4.POSITION_MATRIX, 3.5);
  LIBS.rotateX(HandFlame4.MOVE_MATRIX, (-80 * Math.PI) / 180);
  LIBS.rotateY(HandFlame4.MOVE_MATRIX, (45 * Math.PI) / 180);
  LIBS.rotateZ(HandFlame4.MOVE_MATRIX, (15 * Math.PI) / 180);
  LIBS.translateX(HandFlame4.MOVE_MATRIX, 0.1);
  LIBS.translateZ(HandFlame4.MOVE_MATRIX, 0.1);

  // Enviroment Model
  var Mountain1 = new Mountain(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
  var DeadTree1 = new DeadTree(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);

  Land.childs.push(Mountain1);
  Land.childs.push(DeadTree1);

  // Tree
  LIBS.translateZ(DeadTree1.POSITION_MATRIX, -31);
  LIBS.translateY(DeadTree1.POSITION_MATRIX, 6);

  var trees = [];
  for (let i = 0; i <= 6; i++) {
    const tree = new DeadTree(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);

    // custom coordinat tree
    const customTY = { 0: 3, 1: 3, 2: 5, 3: 0, 4: -2, 5: -4, 6: -5 };
    let offsetTY = customTY[i] ?? 0;
    LIBS.translateY(tree.POSITION_MATRIX, offsetTY);

    const customTX = { 0: -45, 1: -60, 2: 65, 3: 28, 4: -28, 5: 50, 6: -20 };
    let offsetTX = customTX[i] ?? 0;
    LIBS.translateX(tree.POSITION_MATRIX, offsetTX);

    const customTZ = { 0: -50, 1: -3, 2: -25, 3: -4, 4: 8, 5: 38, 6: 50 };
    let offsetTZ = customTZ[i] ?? 0;
    LIBS.translateZ(tree.POSITION_MATRIX, offsetTZ);

    trees.push(tree);
  }

  for (let i = 0; i <= 6; i++) {
    Land.childs.push(trees[i]);
  }

  //land
  LIBS.translateY(Land.POSITION_MATRIX, -5);
  LIBS.scaleX(Land.POSITION_MATRIX, 0.5);
  LIBS.scaleY(Land.POSITION_MATRIX, 0.5);
  LIBS.scaleZ(Land.POSITION_MATRIX, 0.5);

  // Mountain
  LIBS.translateZ(Mountain1.POSITION_MATRIX, -31);
  LIBS.translateY(Mountain1.POSITION_MATRIX, 7);

  //----------------------------------------------------------------------------------------------------------
  // Stone Path
  const controlPoints = [
    { x: -50, y: 0, z: 0 },
    { x: 0, y: 0, z: -15 },
    { x: 15, y: 0, z: -35 },
    { x: -10, y: 0, z: -55 },
    { x: -20, y: 0, z: -75 },
    { x: 110, y: 0, z: -100 },
  ];

  function catmullRom(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;

    return {
      x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
      y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      z: 0.5 * (2 * p1.z + (-p0.z + p2.z) * t + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3),
    };
  }
  function generateSplinePoints(points, samplesPerSegment = 20) {
    const result = [];
    for (let i = 0; i < points.length - 3; i++) {
      for (let t = 0; t <= 1; t += 1 / samplesPerSegment) {
        result.push(catmullRom(points[i], points[i + 1], points[i + 2], points[i + 3], t));
      }
    }
    return result;
  }
  const splinePoints = generateSplinePoints(controlPoints);
  function getDirection(i) {
    if (i <= 0) return { x: 1, z: 0 };

    const p1 = splinePoints[i - 1];
    const p2 = splinePoints[i];

    const dx = p2.x - p1.x;
    const dz = p2.z - p1.z;

    const len = Math.sqrt(dx * dx + dz * dz) || 1;

    return { x: dx / len, z: dz / len };
  }
  function getNormalVector(dir) {
    return { x: -dir.z, z: dir.x };
  }

  // ZIG-ZAG PATH PLACEMENT
  let path = [];
  let lastPlaced = null;
  let zigzagLeft = true;

  const spacing = 1.5;
  const offsetDist = 1.5; // jarak zigzag kiri-kanan
  let baseY = 0; // posisi vertikal batu

  function placeZigZagStone(P, i) {
    const dir = getDirection(i);
    const normal = getNormalVector(dir);

    const offset = zigzagLeft ? offsetDist : -offsetDist;

    var tempZ = P.z + normal.z * offset;

    if ((tempZ >= -28 && tempZ <= -20) || (tempZ >= -46 && tempZ <= -42) || (tempZ >= -74 && tempZ <= -68)) {
      baseY += 0.4;
    }
    const finalPos = {
      x: P.x + normal.x * offset,
      y: baseY + P.y,
      z: P.z + normal.z * offset,
    };

    const stone = new StoneBorder(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);

    LIBS.scaleX(stone.POSITION_MATRIX, 0.5);
    LIBS.scaleY(stone.POSITION_MATRIX, 0.5);
    LIBS.scaleZ(stone.POSITION_MATRIX, 0.5);

    // custom offsetY
    const customY = {
      5: -0.3,
      6: -0.4,
      8: -0.5,
      10: -0.9,
      12: -0.1,
      26: -0.3,
      27: -0.5,
      28: -0.7,
      29: -1.3,
      30: -0.8,
      31: -1.5,
      32: -0.5,
      33: -1,
      35: -0.3,
      53: -0.3,
      55: -0.8,
      57: 0.2,
    };
    let offsetY = customY[i] ?? 0; // kalau tidak ada, pakai 0
    LIBS.translateY(stone.POSITION_MATRIX, finalPos.y + offsetY);

    const customX = {
      22: -1,
      38: -1,
      53: 0.5,
      55: 0.5,
      57: -1,
      58: -3,
      59: -5.5,
    };
    let offsetX = customX[i] ?? 0; // kalau tidak ada, pakai 0
    LIBS.translateX(stone.POSITION_MATRIX, finalPos.x + 10 + offsetX);

    const customZ = {
      5: -1,
      6: -1,
      22: -1,
      38: -1,
      39: -1,
      55: 1.5,
      57: -0.7,
      58: 3,
      59: -2,
    };
    let offsetZ = customZ[i] ?? 0; // kalau tidak ada, pakai 0
    LIBS.translateZ(stone.POSITION_MATRIX, finalPos.z + 10 + offsetZ);

    // custom rotateY
    const customRy = {
      8: -25,
      10: -25,
    };
    let offsetRy = customRy[i] ?? 0; // kalau tidak ada, pakai 0
    LIBS.rotateY(stone.MOVE_MATRIX, (offsetRy * Math.PI) / 180);

    // custom rotateX
    const customRx = {
      8: 20,
      10: 20,
      30: 13,
      31: 15,
      32: 15,
      33: 23,
      35: 10,
      53: 20,
      55: 20,
      58: 10,
    };
    let offsetRx = customRx[i] ?? 0; // kalau tidak ada, pakai 0
    LIBS.rotateX(stone.MOVE_MATRIX, (offsetRx * Math.PI) / 180);

    path.push(stone);

    zigzagLeft = !zigzagLeft;
  }

  // LOOP UTAMA PASANG BATU ZIGZAG
  for (let i = 0; i < splinePoints.length; i++) {
    const P = splinePoints[i];

    if (!lastPlaced) {
      placeZigZagStone(P, i);
      lastPlaced = P;
      continue;
    }

    const dx = P.x - lastPlaced.x;
    const dz = P.z - lastPlaced.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist >= spacing) {
      placeZigZagStone(P, i);
      lastPlaced = P;
    }
  }

  for (let i = 0; i < path.length; i++) {
    GraveArch1.childs.push(path[i]);
  }
  //----------------------------------------------------------------------------------------------------------

  // graveyard arch
  LIBS.translateY(GraveArch1.POSITION_MATRIX, 2.1);
  LIBS.translateZ(GraveArch1.POSITION_MATRIX, 40);

  // loop for fences
  let fences = [];
  let verFences = [];

  for (let i = 0; i < 16; i++) {
    // vertical fences
    const fence = new Fence(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    const vfence = new Fence(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, 0.05, 4.0, 1, 2);

    LIBS.scaleX(fence.POSITION_MATRIX, 5);
    LIBS.scaleY(fence.POSITION_MATRIX, 5);
    LIBS.scaleZ(fence.POSITION_MATRIX, 5);

    // horizontal fences
    LIBS.scaleX(vfence.POSITION_MATRIX, 5);
    LIBS.scaleY(vfence.POSITION_MATRIX, 5);
    LIBS.scaleZ(vfence.POSITION_MATRIX, 5);

    if (i <= 1) {
      // pagar sebelah kanan arch
      LIBS.rotateZ(vfence.MOVE_MATRIX, (90 * Math.PI) / 180);
      LIBS.translateY(vfence.MOVE_MATRIX, 0.5);
      LIBS.translateX(vfence.MOVE_MATRIX, 6 + i * 2);
    } else if (i >= 2 && i <= 5) {
      // pagar sebelah kanan graveyard
      LIBS.rotateZ(vfence.MOVE_MATRIX, (90 * Math.PI) / 180);
      LIBS.rotateY(vfence.MOVE_MATRIX, (90 * Math.PI) / 180);
      LIBS.translateY(vfence.MOVE_MATRIX, 0.5 + (i - 2) * 0.3);
      LIBS.translateX(vfence.MOVE_MATRIX, 8);
      LIBS.translateZ(vfence.MOVE_MATRIX, -4 + (i - 2) * -4);
    } else if (i >= 6 && i <= 9) {
      // pagar belakang graveyard
      LIBS.rotateZ(vfence.MOVE_MATRIX, (90 * Math.PI) / 180);
      LIBS.translateY(vfence.MOVE_MATRIX, 1.4);
      LIBS.translateX(vfence.MOVE_MATRIX, 8 + (i - 6) * -4);
      LIBS.translateZ(vfence.MOVE_MATRIX, -16);
    } else if (i >= 10 && i <= 13) {
      // pagar sebelah kiri graveyard
      LIBS.rotateZ(vfence.MOVE_MATRIX, (90 * Math.PI) / 180);
      LIBS.rotateY(vfence.MOVE_MATRIX, (90 * Math.PI) / 180);
      LIBS.translateY(vfence.MOVE_MATRIX, 0.5 + (i - 10) * 0.3);
      LIBS.translateX(vfence.MOVE_MATRIX, -8);
      LIBS.translateZ(vfence.MOVE_MATRIX, -4 + (i - 10) * -4);
    } else if (i > 13) {
      // pagar sebelah kiri arch
      LIBS.rotateZ(vfence.MOVE_MATRIX, (90 * Math.PI) / 180);
      LIBS.translateY(vfence.MOVE_MATRIX, 0.5);
      LIBS.translateX(vfence.MOVE_MATRIX, -4 + (i - 14) * 2);
    }
    verFences.push(vfence);

    if (i <= 1) {
      // pagar sebelah kanan arch
      LIBS.translateX(fence.POSITION_MATRIX, 10 + i * 10);
    } else if (i >= 2 && i <= 5) {
      // pagar sebelah kanan graveyard
      LIBS.rotateY(fence.MOVE_MATRIX, (90 * Math.PI) / 180);
      LIBS.translateX(fence.POSITION_MATRIX, 40);
      LIBS.translateY(fence.POSITION_MATRIX, (i - 2) * 1.5);
      LIBS.translateZ(fence.POSITION_MATRIX, -20 * (i - 2));
    } else if (i >= 6 && i <= 9) {
      // pagar belakang graveyard
      LIBS.translateX(fence.POSITION_MATRIX, 20.3 - (i - 6) * 20);
      LIBS.translateY(fence.POSITION_MATRIX, 4.5);
      LIBS.translateZ(fence.POSITION_MATRIX, -80);
    } else if (i >= 10 && i <= 13) {
      // pagar sebelah kiri graveyard
      LIBS.rotateY(fence.MOVE_MATRIX, (90 * Math.PI) / 180);
      LIBS.translateX(fence.POSITION_MATRIX, -40);
      LIBS.translateY(fence.POSITION_MATRIX, (i - 10) * 1.5);
      LIBS.translateZ(fence.POSITION_MATRIX, -20 * (i - 10));
    } else if (i > 13) {
      // pagar sebelah kiri arch
      LIBS.translateX(fence.POSITION_MATRIX, -40 + (i - 14) * 10);
    }
    fences.push(fence);
  }

  // attach all to arch (parent)
  for (let i = 0; i < fences.length; i++) {
    GraveArch1.childs.push(fences[i]);
    GraveArch1.childs.push(verFences[i]);
  }

  // === GRAVESTONES + DIRT + CANDLE ===
  const graves = [];
  const graveCount = 70;
  var type = 2;

  // easy to tweak
  const colsPerRow = 10; // number of graves per row
  const rowSpacing = 8; // horizontal spacing (X)
  const startX = -36; // starting X offset

  const rowYLevels = [-1.8, 0, 0, 1.8, 1.8, 3.6, 3.6]; // Y offset for each row (adjust as needed)
  const rowZOffsets = [28, 16, 6, -7, -16, -29, -38]; // Z starting position for each row

  for (let i = 0; i < graveCount; i++) {
    // === Grid layout ===
    const row = Math.floor(i / colsPerRow);
    const col = i % colsPerRow;
    const baseX = startX + col * rowSpacing;
    // Use row-specific Z offset; fallback to 0 if row not in array
    const baseZ = rowZOffsets[row] !== undefined ? rowZOffsets[row] : 0;

    // TODO: customize which graves to skip or not have candles
    const skipGrave = [6, 17, 21, 26, 27, 34, 35, 38, 42, 43, 44, 52, 53, 54, 55, 62, 63, 64, 65];
    const noCandle = [];

    // skip full grave
    if (skipGrave.includes(i)) continue;

    // === Gravestone ===
    type = randomInt(0, 2)
    if (type == 0) var stone = new GravestoneA(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    if (type == 1) {
      var stone = new NonSymmetricalBoxGrave(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
      LIBS.translateY(stone.POSITION_MATRIX, 0.5);
    }
    if (type == 2) {
      var stone = new CrossGravestone(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
      LIBS.translateY(stone.POSITION_MATRIX, 0.4);
    }

    LIBS.translateX(stone.POSITION_MATRIX, baseX);
    LIBS.translateZ(stone.POSITION_MATRIX, baseZ);
    // Apply row-specific Y level
    LIBS.translateY(stone.POSITION_MATRIX, (rowYLevels[row] !== undefined ? rowYLevels[row] : 0) + 3);

    // === Dirt mound ===
    const dirt = new OutwardDirt(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    LIBS.scaleX(dirt.POSITION_MATRIX, 2);
    LIBS.scaleY(dirt.POSITION_MATRIX, 2);
    LIBS.scaleZ(dirt.POSITION_MATRIX, 2.5);
    LIBS.translateZ(dirt.POSITION_MATRIX, 0.2);
    LIBS.translateY(dirt.POSITION_MATRIX, 0.7);

    if (type == 1 || type == 2) {
      LIBS.translateY(dirt.POSITION_MATRIX, -10);
    }

    let candle = null;
    let candleFlame = null;

    // only add candle if not in noCandle list
    if (!noCandle.includes(i)) {
      candle = new CandleBody(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
      LIBS.rotateX(candle.MOVE_MATRIX, (90 * Math.PI) / 180);

      if (randomInt(0, 1) == 1) LIBS.translateX(candle.POSITION_MATRIX, 1.3);
      else LIBS.translateX(candle.POSITION_MATRIX, -1.3);
      LIBS.translateZ(candle.POSITION_MATRIX, 0.3);
      LIBS.translateY(candle.POSITION_MATRIX, 1.3);

      candleFlame = new CandleFlame(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
      LIBS.rotateX(candleFlame.POSITION_MATRIX, (180 * Math.PI) / 180);
      LIBS.rotateZ(candleFlame.POSITION_MATRIX, (90 * Math.PI) / 180);
      LIBS.scaleX(candleFlame.POSITION_MATRIX, 0.35);
      LIBS.scaleY(candleFlame.POSITION_MATRIX, 0.35);
      LIBS.scaleZ(candleFlame.POSITION_MATRIX, 0.5);
      LIBS.translateZ(candleFlame.MOVE_MATRIX, 1);

      if (type == 1) {
        LIBS.translateY(candle.POSITION_MATRIX, -0.8);
      } else if (type == 2) {
        LIBS.translateY(candle.POSITION_MATRIX, -0.8);
      }
    }

    // Save for later reference
    graves.push({ stone, dirt, candle, candleFlame });
  }

  // === Attach all to the parent object ===
  for (let i = 0; i < graves.length; i++) {
    // always attach the gravestone and dirt
    Land.childs.push(graves[i].stone);
    graves[i].stone.childs.push(graves[i].dirt);

    // only attach candle + flame if they exist
    if (graves[i].candle) {
      graves[i].stone.childs.push(graves[i].candle);
      if (graves[i].candleFlame) graves[i].candle.childs.push(graves[i].candleFlame);
    }
  }

  var PROJMATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
  // var MOVEMATRIX = LIBS.get_I4();
  var VIEWMATRIX = LIBS.get_I4();

  LIBS.translateZ(VIEWMATRIX, 0);

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

  // Object1.setup();
  // Gravestone1.setup();
  Land.setup();
  OutHead.setup();
  LitwickBodyClylinder1.setup();

  /*========================= Free Camera with Orbital Rotation =========================*/
  const camPos = [0, 0, 45]; // default 0,0,0
  var yaw = 3.141; // default 0
  var pitch = 0; // default 0

  var camSpeed = 0.005;
  var rotSpeed = 0.00077;
  var keys = {};

  window.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
  window.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

  function updateCamera(dt) {
    const moveSpeed = camSpeed * dt;
    const rotStep = rotSpeed * dt;

    // Rotation input
    if (keys["arrowleft"]) yaw += rotStep;
    if (keys["arrowright"]) yaw -= rotStep;
    if (keys["arrowup"]) pitch += rotStep;
    if (keys["arrowdown"]) pitch -= rotStep;

    // Clamp pitch to prevent flipping
    const limit = Math.PI / 2 - 0.01;
    if (pitch > limit) pitch = limit;
    if (pitch < -limit) pitch = -limit;

    // Direction vectors based on current yaw/pitch
    const forward = [Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)];
    const right = [Math.cos(yaw), 0, -Math.sin(yaw)];
    const up = [0, 1, 0];

    // Movement input
    let move = [0, 0, 0];

    // forward/back: W moves forward, S moves backward
    if (keys["w"]) move = LIBS.add(move, forward);
    if (keys["s"]) move = LIBS.subtract(move, forward);
    if (keys["d"]) move = LIBS.subtract(move, right);
    if (keys["a"]) move = LIBS.add(move, right);
    if (keys[" "]) move = LIBS.add(move, up);
    if (keys["shift"]) move = LIBS.subtract(move, up);

    // Apply movement
    const len = Math.hypot(...move);
    if (len > 0) {
      move = move.map((v) => (v / len) * moveSpeed);
      camPos[0] += move[0];
      camPos[1] += move[1];
      camPos[2] += move[2];
    }

    // Build view matrix: camera position is always the center (0,0,0)
    const eye = camPos;
    const center = [camPos[0] + forward[0], camPos[1] + forward[1], camPos[2] + forward[2]];

    // f = normalize(center - eye)
    const f = LIBS.normalize(LIBS.subtract(center, eye));
    // s = normalize(cross(f, up))
    const s = LIBS.normalize(LIBS.cross(f, up));
    // u = cross(s, f)
    const u = LIBS.cross(s, f);

    const view = LIBS.get_I4();

    // Set rotation part
    view[0] = s[0];
    view[1] = u[0];
    view[2] = -f[0];
    view[3] = 0;

    view[4] = s[1];
    view[5] = u[1];
    view[6] = -f[1];
    view[7] = 0;

    view[8] = s[2];
    view[9] = u[2];
    view[10] = -f[2];
    view[11] = 0;

    // Set translation part: -dot(s,eye), -dot(u,eye), dot(f,eye)
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    view[12] = -dot(s, eye);
    view[13] = -dot(u, eye);
    view[14] = dot(f, eye);
    view[15] = 1;

    return view;
  }
  /*========================= Animation ========================= */
  var time_prev = 0;
  var bounceHeight = 0.5; // Max vertical bounce height
  var bounceSpeed = 0.0025; // Bounce speed multiplier
  var bounceTime = 0; // Time accumulator for bouncing

  var animate = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT);

    var dt = time - time_prev;
    time_prev = time;

    /*========================= Litwick ========================= */
    bounceTime += dt;

    // Calculate bounce offsets for smooth movement in 3D
    var bounceOffsetY = Math.abs(Math.sin(bounceTime * bounceSpeed)) * bounceHeight; // Up and down
    var bounceOffsetX = Math.sin(bounceTime * bounceSpeed * 0.5) * 0.2; // Side to side slower
    var bounceOffsetZ = Math.cos(bounceTime * bounceSpeed * 0.5) * 0.2; // Forward/back slower

    // stretch Y when jumping

    // Reset previous translations before applying new ones (to prevent accumulation)
    if (LitwickBodyClylinder1.prevBounceOffsetY !== undefined) {
      LIBS.translateY(LitwickBodyClylinder1.POSITION_MATRIX, -LitwickBodyClylinder1.prevBounceOffsetY);
      LIBS.translateX(LitwickBodyClylinder1.POSITION_MATRIX, -LitwickBodyClylinder1.prevBounceOffsetX);
      LIBS.translateZ(LitwickBodyClylinder1.POSITION_MATRIX, -LitwickBodyClylinder1.prevBounceOffsetZ);
    }
    // Undo previous scale before applying new one
    if (LitwickBodyClylinder1.prevScaleY !== undefined) {
      var inversePrevScaleY = 1 / LitwickBodyClylinder1.prevScaleY;
      LIBS.scaleY(LitwickBodyClylinder1.POSITION_MATRIX, inversePrevScaleY);
    }

    // Apply new bounce translation
    LIBS.translateY(LitwickBodyClylinder1.POSITION_MATRIX, bounceOffsetY);
    LIBS.translateX(LitwickBodyClylinder1.POSITION_MATRIX, bounceOffsetX);
    LIBS.translateZ(LitwickBodyClylinder1.POSITION_MATRIX, bounceOffsetZ);

    // Apply new scale based on bounce (stretch Y)
    var baseScaleY = 1.0;
    var maxStretch = 0.1;
    var scaleY = baseScaleY + (bounceOffsetY / bounceHeight) * maxStretch;
    LIBS.scaleY(LitwickBodyClylinder1.POSITION_MATRIX, scaleY);

    // Save current offsets and scale for next frame
    LitwickBodyClylinder1.prevBounceOffsetY = bounceOffsetY;
    LitwickBodyClylinder1.prevBounceOffsetX = bounceOffsetX;
    LitwickBodyClylinder1.prevBounceOffsetZ = bounceOffsetZ;
    LitwickBodyClylinder1.prevScaleY = scaleY;

    /*========================= Lampent ========================= */
    // SWING ANIMATION using sine wave
    var swingAmplitude = 0.3; // ~17 degrees in radians
    var swingSpeed = 0.0015;
    var swingAngle = swingAmplitude * Math.sin(time * swingSpeed);

    // Reset OutHead matrix and apply swing + base tilt
    OutHead.MOVE_MATRIX = LIBS.get_I4();
    LIBS.rotateZ(OutHead.MOVE_MATRIX, 15 * (Math.PI / 180)); // base tilt ~15 degrees
    LIBS.rotateY(OutHead.MOVE_MATRIX, swingAngle);

    // INFINITY PATH (lemniscate ∞) for OutHead position
    var A = 3.0; // horizontal amplitude
    var B = 2.0; // depth amplitude
    var t = time * 0.001;
    var posX = A * Math.sin(t);
    var posZ = B * Math.sin(t) * Math.cos(t);
    var posY = 4.5 + 0.5 * Math.sin(t * 2);

    LIBS.translateX(OutHead.MOVE_MATRIX, posX);
    LIBS.translateZ(OutHead.MOVE_MATRIX, posZ);
    LIBS.translateY(OutHead.MOVE_MATRIX, posY);

    // HAND ROTATION ANIMATION using sine wave
    var armAmplitude = 0.4; // radians (~23 degrees)
    var armSpeed = 0.002;
    var armAngle = armAmplitude * Math.sin(time * armSpeed);

    // Right Hand
    LampentHand1.MOVE_MATRIX = LIBS.get_I4();
    LIBS.rotateZ(LampentHand1.MOVE_MATRIX, 90 * (Math.PI / 180) + armAngle);
    LIBS.rotateX(LampentHand1.MOVE_MATRIX, 180 * (Math.PI / 180));

    // Left Hand (opposite direction)
    LampentHand2.MOVE_MATRIX = LIBS.get_I4();
    LIBS.rotateZ(LampentHand2.MOVE_MATRIX, -90 * (Math.PI / 180) + armAngle);

    /*========================= Chandelure ========================= */
    // ANIMASI BERAYUN (swing)
    var amplitude = (10 * Math.PI) / 180; // 10 derajat
    var speed = 0.0015;
    var angle = amplitude * Math.sin(time * speed);

    // reset head matrix
    Object1.MOVE_MATRIX = LIBS.get_I4();
    LIBS.rotateX(Object1.MOVE_MATRIX, (90 * Math.PI) / 180);
    LIBS.rotateY(Object1.MOVE_MATRIX, (30 * Math.PI) / 180);
    LIBS.rotateZ(Object1.MOVE_MATRIX, angle);
    LIBS.rotateX(Object1.MOVE_MATRIX, angle / 2);

    // INFINITY PATH (lemniscate ∞)
    // Parametric equations for an infinity (lemniscate) path
    // x = A * sin(t), z = B * sin(t) * cos(t)
    var A = 3.0; // horizontal size
    var B = 2.0; // depth size
    var t = time * 0.001; // speed of movement
    var posX = A * Math.sin(t);
    var posZ = B * Math.sin(t) * Math.cos(t);
    var posY = 4.5 + 0.5 * Math.sin(t * 2); // slight up-down motion

    // Apply translation to move Chandelure along infinity path
    LIBS.translateX(Object1.MOVE_MATRIX, posX + 8);
    LIBS.translateZ(Object1.MOVE_MATRIX, posZ - 4);
    LIBS.translateY(Object1.MOVE_MATRIX, posY - 1);

    // ANIMASI GERAK TANGAN (arms)
    var armAmplitude = (8 * Math.PI) / 180;
    var armSpeed = 0.005;
    var armAngle = armAmplitude * Math.sin(time * armSpeed);

    // Right Arm
    Hand1.MOVE_MATRIX = LIBS.get_I4();
    LIBS.rotateX(Hand1.MOVE_MATRIX, (90 * Math.PI) / 180);
    LIBS.rotateY(Hand1.MOVE_MATRIX, (-20 * Math.PI) / 180 - armAngle);
    LIBS.rotateZ(Hand1.MOVE_MATRIX, (-90 * Math.PI) / 180);
    LIBS.translateY(Hand1.MOVE_MATRIX, 13);
    LIBS.translateZ(Hand1.MOVE_MATRIX, 26);

    // Left Arm
    Hand2.MOVE_MATRIX = LIBS.get_I4();
    LIBS.rotateX(Hand2.MOVE_MATRIX, (-90 * Math.PI) / 180);
    LIBS.rotateY(Hand2.MOVE_MATRIX, (20 * Math.PI) / 180 + armAngle);
    LIBS.rotateZ(Hand2.MOVE_MATRIX, (-90 * Math.PI) / 180);
    LIBS.translateY(Hand2.MOVE_MATRIX, 13);
    LIBS.translateZ(Hand2.MOVE_MATRIX, -26);

    /*============================================================= */

    var cam = updateCamera(dt);

    GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
    GL.uniformMatrix4fv(_Vmatrix, false, cam);

    // Object1.render(LIBS.get_I4());
    // Gravestone1.render(LIBS.get_I4());
    Land.render(LIBS.get_I4());

    // PASS 1: Render opaque objects (all children) with depth writing
    GL.depthMask(true);
    // Render all children without the head itself
    InHead.childs.forEach((child) => child.render(LIBS.multiply(OutHead.MOVE_MATRIX, OutHead.POSITION_MATRIX)));

    // PASS 2: Render translucent head without depth writing
    GL.depthMask(false);
    // Only render the Head sphere, not its children
    renderHeadOnly(OutHead, LIBS.get_I4());
    GL.depthMask(true);

    LitwickBodyClylinder1.render(LIBS.get_I4());

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

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
