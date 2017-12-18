import Canvas from "./Utility/canvas.js";
import {glMatrix, mat4, vec3, quat} from "./Utility/GL/gl-matrix.js";
import {requestAnimFrame} from "./Utility/GL/webgl-utils.js";
import { Controller } from "./Utility/controller.js";
import MeshLoader from "./Mesh/mesh_loader.js";
import TextureLoader from "./Texture/texture_loader.js";

import M_Shader from "./Shader/M_shader.js";
import ComplexShader from "./Shader/complex_shader.js";
import DepthShader from "./Shader/depth_shader.js";

import M_Object from "./Object/M_Object.js";
import Scene from "./Essentials/scene.js";
import Camera from "./Essentials/camera.js";
import Light from "./Essentials/light.js";

import game_setup from "../Game/game.js";
import ShadowMap from "./Utility/shadow_map.js";


///////////////////////////////////////////////////////////////


export let gl : WebGLRenderingContext;
export let canvas : Canvas;

export let projection_matrix : mat4;
export let view_matrix : mat4;
export let objects : M_Object[] = [];

export let shader : M_Shader;
export let depth_shader : M_Shader;
export let scene : Scene;
export let camera : Camera;

export let light : Light;

export default class Engine {

    static async setup() {

        Engine.initialize_canvas_and_gl();

        await MeshLoader.load_all();
        await TextureLoader.load_all();

        await Engine.initialize_basics();
        await game_setup();
        await Engine.cycle ();
    }

    static initialize_canvas_and_gl() {

        canvas = new Canvas( 'gl-canvas', 1024, 512, 512 );
        gl = canvas.getGL();

        console.log( gl );

        //  Configure gl
        gl.enable( gl.DEPTH_TEST) ;
        gl.depthFunc( gl.LEQUAL );
        gl.enable( gl.CULL_FACE );

        //  Initialize shaders
        shader = new ComplexShader();
        depth_shader = new DepthShader();

        //  Initialize depth buffer
        ShadowMap.initialize();

        //  Refresh canvas to fit starting window
        canvas.refresh();
    }

    static async initialize_basics() {

        console.log( "Game Setup Started" );

        Controller.init_controller();

        //  Initialize the scene
        scene = new Scene( shader );
        attach_to_loop( scene );

        //  Create the projection matrix of the camera
        const camera_projection_matrix = mat4.perspective( mat4.create(), glMatrix.toRadian(45), canvas.width / canvas.height, 50, 2000 );

        //  Initialize the camera
        const eye = vec3.fromValues(0, 1400,300);
        const target = vec3.fromValues(0,20,0);
        camera = new Camera( eye, target, camera_projection_matrix );
        camera.model.translate_global( eye );
        attach_to_loop( camera );


        //  Create the projection matrix of the camera
        const light_projection_matrix = mat4.ortho( mat4.create(), -250, 250, -125, 125, -100, 1400 );
        // const light_projection_matrix = mat4.perspective( mat4.create(), glMatrix.toRadian(45), canvas.width / canvas.height, 50, 600 );

        //  Initialize light
        light = new Light( vec3.fromValues( -200,60,200 ), light_projection_matrix );
        attach_to_loop( light );

        light.shadow_map = ShadowMap.depth;

        console.log("Setup Completed");
    }

    static async cycle() {

        // for( const obj of objects ) {
        //     obj.move();
        // }
        //
        // for( const obj of objects ) {
        //     obj.collide();
        // }

        for( const obj of objects ) {
            obj.update();
        }

        //  Draw to Shadow Map
        light.calc_view_matrix();
        projection_matrix = light.projection_matrix;
        view_matrix = light.view_matrix;
        gl.cullFace( gl.FRONT );
        gl.bindFramebuffer( gl.FRAMEBUFFER, ShadowMap.frame_buffer );
        gl.clear( gl.DEPTH_BUFFER_BIT );
        await scene.draw();


        //  Draw to Canvas
        projection_matrix = camera.projection_matrix;
        view_matrix = camera.view_matrix;
        gl.cullFace( gl.BACK );
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
        gl.clearColor( 0.4, 0.8, 1, 1.0 );
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        if( Controller.depth_debug ) {

            await ShadowMap.draw();
        }
        else {

            await scene.draw();
        }

        requestAnimFrame( Engine.cycle, canvas );
    }
}

export function attach_to_loop( new_obj : M_Object ) {
    objects.push( new_obj );
}
