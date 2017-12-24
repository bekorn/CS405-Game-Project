import Engine, { attach_to_loop, scene } from "../Engine/engine.js";
import { vec3 } from "../Engine/Utility/GL/gl-matrix.js";
import Axes from "./Objects/Axes.js";
import Lives from "./Objects/lives.js";
import Player from "./Objects/player.js";
import Hall from "./Objects/hall.js";

window.addEventListener('load', Engine.setup );

document.addEventListener("visibilitychange", () => {

    if( document.visibilityState == 'hidden' ) {

        Engine.pause();
    }
    else {

        Engine.resume();
    }
});

export default function game_setup() {

    const player = new Player();
    attach_to_loop( player );

    const hall_width = 250;
    const hall_height = 200;
    const hall_length = 300;

    new Hall( 250, 200, 360 );


    const lives = new Lives();
    attach_to_loop( lives );
}



///////////     TEST       ///////////////
function axes_setup() {

    //  Create main axes
    const main_axes = new Axes( scene );
    main_axes.model.scale_down( 5 );
    // attach_to_loop( main_axes );
    console.log( main_axes.model );


    // Test Objects
    const sat_1 = new Axes( scene );
    sat_1.model.scale_down( 10 );
    sat_1.model.translate_global( vec3.fromValues(0, 200, 0 ) );
    attach_to_loop( sat_1 );
    console.log( "sat_1", sat_1.model );
    console.log( "sat_1", sat_1.model.global_position() );

    const sat_2 = new Axes( sat_1 );
    sat_2.model.scale_down( 2 );
    sat_2.model.translate_global( vec3.fromValues( 0, 100, 0 ) );
    attach_to_loop( sat_2 );
    console.log( "sat_2", sat_2.model );
    console.log( "sat_2", sat_2.model.global_position() );

    const sat_3 = new Axes( sat_2 );
    sat_3.model.scale_up( 0.5 );
    sat_3.model.translate_global( vec3.fromValues( 0, 100, 0 ) );
    attach_to_loop( sat_3 );
    console.log( "sat_3", sat_3.model );
    console.log( "sat_3", sat_3.model.global_position() );
}
