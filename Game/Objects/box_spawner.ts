import M_Object from "../../Engine/Object/M_Object.js";
import { vec3 } from "../../Engine/Utility/GL/gl-matrix.js";
import CubeMesh from "../Meshes/cube.js";
import { hall } from "../game.js";
import { time_passed } from "../../Engine/engine.js";

export default class BoxSpawner extends M_Object {

    frequency : number;

    timeout_id : number;

    constructor( frequency ) {
        super();

        this.frequency = frequency;

        this.model.translate_global( vec3.fromValues( 0, 0, -hall.length ) );

        this.timeout_id = window.setTimeout( () => this.spawn_box(), this.frequency );
    }

    remove_self() {

        window.clearTimeout( this.timeout_id );

        super.remove_self();
    }

    spawn_box() {

        const width = (Math.random() * 10 + 6) / 2;
        const height = (Math.random() * 3 + 1.5) / 2;
        const is_up = Math.round( Math.random() ) * 2 - 1;

        const dimensions = vec3.fromValues(width, height, 2);


        const new_box = this.add_mesh( new CubeMesh( dimensions )  );

        new_box.model.translate_global( vec3.fromValues(
            (Math.round( Math.random() ) * 2 - 1) * Math.random() * ( hall.width - width),
            is_up * (hall.height - height),
            0) );

        new_box.attach_bbox( dimensions );


        //  Fasten the speed
        this.frequency -= time_passed / 2;

        this.timeout_id = window.setTimeout( () => this.spawn_box(), this.frequency );
    }

    update( delta_time ) {

        for( let mesh of this.meshes ) {

            mesh.model.translate_global( vec3.fromValues(0,0,20 * delta_time) );

            if( mesh.model.global_position()[2] > hall.length * 2 ) {

                mesh.remove_self();
            }

            mesh.update_bbox();
        }
    }
}