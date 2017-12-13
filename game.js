var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Canvas from "./Utility/canvas.js";
import { requestAnimFrame } from "./Utility/GL/webgl-utils.js";
import Scene from "./Object/Singleton/Scene.js";
import Camera from "./Object/Singleton/Camera.js";
import { glMatrix, mat4, vec3 } from "./Utility/GL/gl-matrix.js";
import Axes from "./Object/Axes.js";
import { Controller } from "./Utility/Controller.js";
import ComplexShader from "./Utility/Shader/complex_shader.js";
import MeshLoader from "./Assets/mesh_loader.js";
export let gl;
export let canvas;
export let scene;
export let camera;
export let projection_matrix;
export let light;
export let objects = [];
window.addEventListener('load', () => MeshLoader.load_all().then(setup_game).then(game_loop));
function setup_game() {
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
        const shader = new ComplexShader();
        //  Initialize the scene
        scene = new Scene(shader);
        attach_to_loop(scene);
        //  Set the projection matrix
        projection_matrix = mat4.perspective(mat4.create(), glMatrix.toRadian(45), canvas.width / canvas.height, 1, 2000);
        //  Initialize the camera
        const eye = vec3.fromValues(0, 0, 300);
        const target = vec3.fromValues(0, 100, 0);
        camera = new Camera(eye, target);
        attach_to_loop(camera);
        scene.add_child(camera, eye);
        //  Initialize light
        light = vec3.fromValues(600, 600, -600);
        console.log("Setup Completed");
        //////////////////////////////////
        //////        GAME          //////
        //////////////////////////////////
        //  Create main axes
        // const main_axes = new Axes( shader, scene );
        // main_axes.model.scale_down( 5 );
        // // attach_to_loop( main_axes );
        // console.log( main_axes.model );
        // Test Objects
        const sat_1 = new Axes(shader, scene);
        sat_1.model.scale_down(10);
        sat_1.model.translate_global(vec3.fromValues(0, 200, 0));
        attach_to_loop(sat_1);
        console.log("sat_1", sat_1.model);
        console.log("sat_1", sat_1.model.global_position());
        const sat_2 = new Axes(shader, sat_1);
        sat_2.model.scale_down(2);
        sat_2.model.translate_global(vec3.fromValues(0, 100, 0));
        attach_to_loop(sat_2);
        console.log("sat_2", sat_2.model);
        console.log("sat_2", sat_2.model.global_position());
        const sat_3 = new Axes(shader, sat_2);
        sat_3.model.scale_up(0.5);
        sat_3.model.translate_global(vec3.fromValues(0, 100, 0));
        attach_to_loop(sat_3);
        console.log("sat_3", sat_3.model);
        console.log("sat_3", sat_3.model.global_position());
        // camera.follow( scene );
    });
}
export function attach_to_loop(new_obj) {
    objects.push(new_obj);
}
function game_loop() {
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
    scene.draw().then(() => requestAnimFrame(game_loop, canvas));
}
//# sourceMappingURL=game.js.map