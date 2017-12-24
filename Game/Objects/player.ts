import M_Object from "../../Engine/Object/M_Object.js";
import { Controller } from "../../Engine/Utility/controller.js";
import { vec3 } from "../../Engine/Utility/GL/gl-matrix.js";
import TextureLoader from "../../Engine/Texture/texture_loader.js";
import Cube from "./cube.js";

export default class Player extends M_Object {

    body : M_Object;

    constructor() {
        super();

        this.body = new Cube( vec3.fromValues(30, 30, 30), this );
        this.body.meshes[0].texture = TextureLoader.loaded_textures[ 'krabs' ];
    }

    update( delta_time ) {

        if (Controller.left == true) {
            this.body.model.rotateY( 160 * delta_time );
            // this.model.translate(vec3.fromValues(6, 0, 0));
        }
        if (Controller.right == true) {
            this.body.model.rotateY( -160 * delta_time );
            // this.model.translate(vec3.fromValues(-6, 0, 0));
        }
        if (Controller.up == true) {
            // this.model.rotate_globalX( -1 );
            this.body.model.translate(vec3.fromValues(240 * delta_time, 0, 0));
        }
        if (Controller.down == true) {
            // this.model.rotate_globalX( 1 );
            this.body.model.translate(vec3.fromValues(-240 * delta_time, 0, 0));
        }
    }
}