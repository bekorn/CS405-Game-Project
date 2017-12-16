var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Canvas from "./Utility/canvas.js";
import { glMatrix, mat4, vec3 } from "./Utility/GL/gl-matrix.js";
import { requestAnimFrame } from "./Utility/GL/webgl-utils.js";
import MeshLoader from "./Utility/mesh_loader.js";
import { Controller } from "./Utility/controller.js";
import ComplexShader from "./Shader/complex_shader.js";
import Scene from "./Essentials/scene.js";
import Camera from "./Essentials/camera.js";
import Light from "./Essentials/light.js";
import game_setup from "../Game/game.js";
///////////////////////////////////////////////////////////////
export default class Engine {
    static setup() {
        return __awaiter(this, void 0, void 0, function* () {
            MeshLoader.load_all()
                .then(Engine.initialize_basics)
                .then(game_setup)
                .then(Engine.cycle);
        });
    }
    static initialize_basics() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Game Setup Started");
            canvas = new Canvas('gl-canvas', 512, 512, 512);
            gl = canvas.getGL();
            //  Refresh canvas to fit starting window
            canvas.refresh();
            //  Configure gl
            gl.clearColor(0.4, 0.8, 1, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.enable(gl.CULL_FACE);
            Controller.init_controller();
            //  Chose a shader
            shader = new ComplexShader();
            //  Initialize the scene
            scene = new Scene(shader);
            attach_to_loop(scene);
            //  Set the projection matrix
            projection_matrix = mat4.perspective(mat4.create(), glMatrix.toRadian(45), canvas.width / canvas.height, 1, 2000);
            //  Initialize the camera
            const eye = vec3.fromValues(0, 0, 300);
            const target = vec3.fromValues(0, 100, 0);
            camera = new Camera(eye, target);
            camera.model.translate_global(eye);
            attach_to_loop(camera);
            //  Initialize light
            light = new Light(vec3.fromValues(600, 600, -600));
            console.log("Setup Completed");
        });
    }
    static cycle() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const obj of objects) {
                obj.move();
            }
            for (const obj of objects) {
                obj.collide();
            }
            for (const obj of objects) {
                obj.update();
            }
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.clearDepth(1.0);
            scene.draw()
                .then(() => requestAnimFrame(Engine.cycle, canvas));
        });
    }
}
export function attach_to_loop(new_obj) {
    objects.push(new_obj);
}
export let gl;
export let canvas;
export let projection_matrix;
export let objects = [];
export let shader;
export let scene;
export let camera;
export let light;
//# sourceMappingURL=engine.js.map