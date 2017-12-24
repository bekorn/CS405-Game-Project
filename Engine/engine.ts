import Canvas from "./Utility/canvas.js";
import {glMatrix, mat4, vec3, quat} from "./Utility/GL/gl-matrix.js";
import {requestAnimFrame} from "./Utility/GL/webgl-utils.js";
import { Controller } from "./Utility/controller.js";
import MeshLoader from "./Mesh/mesh_loader.js";
import TextureLoader from "./Texture/texture_loader.js";

import M_Shader from "./Shader/M_shader.js";
import ComplexShader from "./Shader/complex_shader.js";
import DepthShader from "./Shader/depth_shader.js";
import UIShader from "./Shader/ui_shader.js";

import M_Object from "./Object/M_Object.js";
import Scene from "./Essentials/scene.js";
import Camera from "./Essentials/camera.js";
import Light from "./Essentials/light.js";
import UI from "./Essentials/ui.js";
import UIElement from "./Essentials/ui_element.js";

import game_setup from "../Game/game.js";
import ShadowMap from "./Utility/shadow_map.js";


///////////////////////////////////////////////////////////////


export let gl : WebGL2RenderingContext;
export let canvas : Canvas;

export let projection_matrix : mat4;
export let view_matrix : mat4;
export let objects : M_Object[] = [];

export let shader : M_Shader;
export let depth_shader : M_Shader;
export let ui_shader : M_Shader;

export let scene : Scene;
export let camera : Camera;
export let light : Light;

export let time : number = Date.now() / 1000;
export let time_passed : number = 0;

export let ui : UI;
let shadowmap_debug : UIElement;

export default class Engine {

    static is_paused : boolean = false;

    static async setup() {

        Engine.initialize_canvas_and_gl();

        await MeshLoader.load_all();
        await TextureLoader.load_all();

        await Engine.initialize_basics();
        await game_setup();
        await Engine.cycle();
    }

    static initialize_canvas_and_gl() {

        canvas = new Canvas( 'gl-canvas', 1024, 512, 512 );
        gl = canvas.getGL();

        console.log( gl );

        //  Configure gl
        gl.enable( gl.DEPTH_TEST) ;
        gl.depthFunc( gl.LEQUAL );
        gl.enable( gl.CULL_FACE );

        console.log(gl.getContextAttributes() );

        //  Initialize shaders
        shader = ComplexShader.initialize();
        depth_shader = DepthShader.initialize();
        ui_shader = UIShader.initialize();

        //  Initialize depth buffer
        ShadowMap.initialize( 1024, 1024 );

        //  Refresh canvas to fit starting window
        canvas.refresh();
    }

    static async initialize_basics() {

        console.log( "Game Setup Started" );

        Controller.init_controller();

        //  Initialize the scene
        scene = new Scene();
        attach_to_loop( scene );

        //  Create the projection matrix of the camera
        const camera_projection_matrix = mat4.perspective( mat4.create(), glMatrix.toRadian(36), canvas.width / canvas.height, 50, 1400 );

        //  Initialize the camera
        const eye = vec3.fromValues(0, 0,800);
        const target = vec3.fromValues(0,0,0);
        camera = new Camera( eye, target, camera_projection_matrix );
        camera.model.translate_global( eye );
        attach_to_loop( camera );


        //  Initialize light
        light = new Light( vec3.fromValues( 0,0,500 ), ShadowMap.width, ShadowMap.height );
        attach_to_loop( light );


        ui = new UI( null );
        attach_to_loop( ui );

        let size : number;

        size = 300;
        shadowmap_debug = new UIElement(
            [size/canvas.width - 1, size/canvas.height - 1],
            [size/canvas.width, size/canvas.height],
            0,
            ShadowMap.depth
        );

        shadowmap_debug.toggle_visibility();


        console.log("Setup Completed");
    }

    static async cycle() {

        const  new_time = Date.now() / 1000;
        const delta_time = new_time - time;
        time = new_time;
        time_passed += delta_time;


        for( const obj of objects ) {
            obj.move();
        }

        for( const obj of objects ) {
            obj.collide();
        }

        for( const obj of objects ) {
            obj.update( delta_time );
        }


        await scene.refresh_model();


        //  Draw to Shadow Map
        gl.viewport( 0, 0, ShadowMap.width, ShadowMap.height );
        light.refresh_matrices( ShadowMap.width, ShadowMap.height );
        projection_matrix = light.projection_matrix;
        view_matrix = light.view_matrix;
        gl.cullFace( gl.FRONT );
        gl.bindFramebuffer( gl.FRAMEBUFFER, ShadowMap.frame_buffer );
        gl.clear( gl.DEPTH_BUFFER_BIT );
        depth_shader.render();


        //  Draw the scene into Screen
        projection_matrix = camera.projection_matrix;
        view_matrix = camera.view_matrix;
        gl.viewport( 0, 0, canvas.dom.width, canvas.dom.height );
        gl.cullFace( gl.BACK );
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
        gl.clearColor( 0.4, 0.8, 1, 1.0 );
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
        shader.render();


        if( Controller.depth_debug ) {

            shadowmap_debug.toggle_visibility();
        }


        await ui.refresh_model();

        gl.cullFace( gl.FRONT );
        gl.clear( gl.DEPTH_BUFFER_BIT );
        ui_shader.render();


        if( ! Engine.is_paused ) {

            requestAnimFrame( Engine.cycle, canvas );
        }
    }

    static pause() {

        Engine.is_paused = true;
        console.log( "Engine paused!" );
    }

    static resume() {

        Engine.is_paused = false;
        console.log( "Engine resumed!" );

        requestAnimFrame( Engine.cycle, canvas );
    }
}

export function attach_to_loop( new_obj : M_Object ) {
    objects.push( new_obj );
}
