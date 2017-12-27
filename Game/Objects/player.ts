import M_Object from "../../Engine/Object/M_Object.js";
import { Controller } from "../../Engine/Utility/controller.js";
import { vec3 } from "../../Engine/Utility/GL/gl-matrix.js";
import TextureLoader from "../../Engine/Texture/texture_loader.js";
import { game_restart, gravity, hall, lives, spawner } from "../game.js";
import CubeMesh from "../Meshes/cube.js";
import M_Mesh from "../../Engine/Mesh/M_Mesh.js";
import AABB from "../../Engine/Physics/AABB.js";

export default class Player extends M_Object {

    body : M_Mesh;

    velocity : vec3;
    reverse : number = 1;

    speed : number = 8;

    damaged : boolean = false;

    constructor() {
        super();

        const size = vec3.fromValues(1, 1, 1);

        this.body = this.add_mesh( new CubeMesh( size ) );
        this.body.texture = TextureLoader.loaded_textures[ 'Wooden Box' ];

        this.body.attach_bbox( size );

        this.velocity = vec3.fromValues(0,0,0);
    }

    update( delta_time ) {

        if( Controller.keys[ 'left' ].is_down ) {
            vec3.add( this.velocity, this.velocity, vec3.fromValues( -this.speed * delta_time, 0, 0 ) );
        }
        if( Controller.keys[ 'right' ].is_down ) {
            vec3.add( this.velocity, this.velocity, vec3.fromValues( this.speed * delta_time, 0, 0 ) );
        }
        if( Controller.keys[ 'up' ].is_down ) {
            vec3.add( this.velocity, this.velocity, vec3.fromValues( 0, 0, -this.speed * delta_time ) );
        }
        if( Controller.keys[ 'down' ].is_down ) {
            vec3.add( this.velocity, this.velocity, vec3.fromValues( 0, 0, this.speed * delta_time ) );
        }
        if( Controller.keys[ 'space' ].just_pressed ) {
            this.reverse *= -1;
            // this.model.translate( vec3.fromValues( 0, gravity * this.reverse * delta_time * 1, 0 ) );
        }

        const g = gravity * delta_time;
        vec3.add( this.velocity, this.velocity, vec3.fromValues( 0,  this.reverse * (g * g), 0 ) );
    }

    collide( delta_time ) {

        //  Check collision with walls
        for( const wall of hall.meshes ) {

            const collision = this.body.bbox.collides_with_speed( wall.bbox, this.velocity );

            if( collision[3] ) {    //  Collision happened

                this.body.bbox.stick_to( wall.bbox, collision, this.velocity );
                // AABB.stop_movement( collision, this.velocity );
            }
        }

        //  If damaged, don't check
        if( this.damaged ) {

            return;
        }

        //  Check if hit by a box
        for( const box of spawner.meshes ) {

            const collision = this.body.bbox.collides_with( box.bbox );

            if( collision ) {    //  Collision happened

                lives.lost_one();
                box.remove_self();

                this.damaged = true;
                this.body.texture = TextureLoader.loaded_textures[ "Wooden Box Damaged" ];

                setTimeout( () => {
                    this.damaged = false;
                    this.body.texture = TextureLoader.loaded_textures[ "Wooden Box" ];
                }, 2000 );
            }
        }

        if( lives.lives_left <= 0 ) {

            game_restart();
        }
    }

    move( delta_time ) {

        const slow_down = 1 - 0.5;
        vec3.multiply( this.velocity, this.velocity, vec3.fromValues( slow_down, 1 , slow_down ) );

        this.model.translate( this.velocity );

        this.body.update_bbox();
    }
}