import Canvas from "./Utility/canvas.js";
import {requestAnimFrame} from "./Utility/GL/webgl-utils.js";
import M_Object from "./Object/M_Object.js";
import Scene from "./Object/Singleton/Scene.js";
import Camera from "./Object/Singleton/Camera.js";
import {glMatrix, mat4, vec3} from "./Utility/GL/gl-matrix.js";
import Axes from "./Object/Axes.js";
import SimpleShader from "./Utility/Shader/simple_shader.js";
import RectangularPrism from "./Mesh/rectangular_prism.js";

export let gl : WebGLRenderingContext;
export let canvas : Canvas;
export let scene : Scene;
export let camera : Camera;
export let projection_matrix : mat4;
export let objects : M_Object[] = [];

window.addEventListener('load', setup_game);

//  Matrix çarpımı denemeleri
let deneme = mat4.create();
let scale = mat4.fromScaling( mat4.create(), vec3.fromValues(3,3,3) );
let trans = mat4.fromTranslation( mat4.create(), vec3.fromValues(10,10,10) );

mat4.multiply( deneme, deneme, trans );
mat4.multiply( deneme, deneme, scale );
mat4.rotateX( deneme, deneme, glMatrix.toRadian(60) );

console.log( "Çarpadan önce:", deneme );
console.log( "Sağdan çarpım:", mat4.multiply( mat4.create(), deneme, scale ) );
console.log( "Soldan çarpım:", mat4.multiply( mat4.create(), scale, deneme ) );

deneme = mat4.create();
mat4.multiply( deneme, deneme, trans );
mat4.multiply( deneme, deneme, scale );
mat4.rotateX( deneme, deneme, glMatrix.toRadian(60) );

console.log( "Çarpadan önce:", deneme );
console.log( "Sağdan çarpım:", mat4.multiply( mat4.create(), deneme, trans ) );
console.log( "Soldan çarpım:", mat4.multiply( mat4.create(), trans, deneme ) );
//  Denemelerin bitişi


function setup_game() {
    canvas = new Canvas( 'gl-canvas', 512, 512, 512 );
    gl = canvas.getGL();

    //  Refresh canvas to fit starting window
    canvas.refresh();

    //  Configure gl
    gl.clearColor( 0.4, 0.8, 1, 1.0 );
    gl.enable( gl.DEPTH_TEST) ;
    gl.depthFunc( gl.LEQUAL );
    //  TODO: This option enables the culling for triangles that not looking at the camera
    //  Currently not working because the models have some problems
    // gl.enable(gl.CULL_FACE);

    //  Set the projection matrix
    projection_matrix = mat4.perspective( mat4.create(), glMatrix.toRadian(45), canvas.width / canvas.height, 1, 1200 );

    //  Initialize the camera
    const eye = vec3.fromValues(400, 400,500);
    const target = vec3.fromValues(0,0,0);
    camera = new Camera( eye, target );
    attach_to_loop( camera );


    const shader = new SimpleShader();

    //  Initialize the scene
    scene = new Scene( shader, vec3.fromValues(0,0,0) );

    console.log("Setup Completed");

    const main_axes = new Axes( shader, vec3.fromValues(0,0,0) );
    vec3.scale( main_axes.model.scale, main_axes.model.scale, 0.1 );
    scene.add_child( main_axes, vec3.fromValues(0, 0, 0 )  );
    // attach_to_loop( main_axes );
    console.log( main_axes.model );

    // Test Objects
    const sat_1 = new Axes( shader, vec3.fromValues(0,0,0) );
    vec3.scale( sat_1.model.scale, sat_1.model.scale, 0.1 );
    scene.add_child( sat_1, vec3.fromValues(0, 100, 0 ) );
    attach_to_loop( sat_1 );
    console.log( "sat_1", sat_1.model );

    const sat_2 = new Axes( shader, vec3.fromValues(0,0,0) );
    vec3.scale( sat_2.model.scale, sat_2.model.scale, 0.5 );
    sat_1.add_child( sat_2, vec3.fromValues( 0, 200, 0 ) );
    attach_to_loop( sat_2 );
    console.log( "sat_2", sat_2.model );

    const sat_3 = new Axes( shader, vec3.fromValues(0,0,0) );
    vec3.scale( sat_3.model.scale, sat_3.model.scale, 0.5 );
    sat_2.add_child( sat_3, vec3.fromValues( 0, 300, 0 ) );
    attach_to_loop( sat_3 );
    console.log( "sat_3", sat_3.model );


    // camera.follow( main_axes );

    //  start game loop
    game_loop();
}

export function attach_to_loop( new_obj : M_Object ) {
    objects.push( new_obj );
}

function game_loop() {

    for( const obj of objects ) {
        obj.move();
    }

    for( const obj of objects ) {
        obj.collide();
    }

    for( const obj of objects ) {
        obj.update();
    }

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.clearDepth(1.0);

    scene.draw( camera.view_matrix );

    requestAnimFrame( game_loop, canvas );
}