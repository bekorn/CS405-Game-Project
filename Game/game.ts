import Engine, { attach_to_loop, camera, reset_time } from "../Engine/engine.js";
import Lives from "./Objects/lives.js";
import Player from "./Objects/player.js";
import Hall from "./Objects/hall.js";
import BoxSpawner from "./Objects/box_spawner.js";

window.addEventListener('load', Engine.setup );

document.addEventListener("visibilitychange", () => {

    if( document.visibilityState == 'hidden' ) {

        Engine.pause();
    }
    else {

        Engine.resume();
    }
});

export let gravity = 6.81;
export let player : Player;
export let hall : Hall;
export let spawner : BoxSpawner;
export let lives : Lives;

export function game_setup() {

    player = new Player();
    attach_to_loop( player );

    camera.follow( player );

    const hall_width = 8;
    const hall_height = 6;
    const hall_length = 40;

    hall = new Hall( hall_width, hall_height, hall_length );

    spawner = new BoxSpawner( 1400 );
    attach_to_loop( spawner );

    lives = new Lives();
    attach_to_loop( lives );
}

export function game_end() {

    player.remove_self();
    spawner.remove_self();
    hall.remove_self();
    lives.remove_self();

    camera.unfollow();
}

export function game_restart() {

    game_end();
    reset_time();
    game_setup();
}
