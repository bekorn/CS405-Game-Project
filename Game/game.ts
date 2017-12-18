import Engine, { attach_to_loop, camera, scene, shader } from "../Engine/engine.js";
import { vec3 } from "../Engine/Utility/GL/gl-matrix.js";
import Axes from "./Objects/Axes.js";
import DeerMesh from "./Meshes/deer.js";
import Cube from "./Objects/cube.js";
import CubeMesh from "./Meshes/cube.js";
import TextureLoader from "../Engine/Texture/texture_loader.js";

window.addEventListener('load', Engine.setup );

export default function game_setup() {

    for( let i=0 ; i<3 ; i++ ) {

        const cube = new Cube( shader, Math.random() * 6 + 10, Math.random()*120 + 90 + (i*Math.random()*4), Math.random()*2.5 + 0.5 );
        // attach_to_loop( cube );
    }

    const cube = scene.add_mesh( new CubeMesh( shader, vec3.fromValues(30,30,30) ) );
    cube.texture = TextureLoader.loaded_textures[ 'krabs' ];

    const floor = scene.add_mesh( new CubeMesh( shader, vec3.fromValues( 650, 1, 650 ) ) );
    floor.texture = TextureLoader.loaded_textures[ 'simple' ];
    floor.model.translate_global( vec3.fromValues( 0, -70, 0 ) );
}

function axes_setup() {

    //  Create main axes
    const main_axes = new Axes( shader, scene );
    main_axes.model.scale_down( 5 );
    // attach_to_loop( main_axes );
    console.log( main_axes.model );


    // Test Objects
    const sat_1 = new Axes( shader, scene );
    sat_1.model.scale_down( 10 );
    sat_1.model.translate_global( vec3.fromValues(0, 200, 0 ) );
    attach_to_loop( sat_1 );
    console.log( "sat_1", sat_1.model );
    console.log( "sat_1", sat_1.model.global_position() );

    const sat_2 = new Axes( shader, sat_1 );
    sat_2.model.scale_down( 2 );
    sat_2.model.translate_global( vec3.fromValues( 0, 100, 0 ) );
    attach_to_loop( sat_2 );
    console.log( "sat_2", sat_2.model );
    console.log( "sat_2", sat_2.model.global_position() );

    const sat_3 = new Axes( shader, sat_2 );
    sat_3.model.scale_up( 0.5 );
    sat_3.model.translate_global( vec3.fromValues( 0, 100, 0 ) );
    attach_to_loop( sat_3 );
    console.log( "sat_3", sat_3.model );
    console.log( "sat_3", sat_3.model.global_position() );
}
