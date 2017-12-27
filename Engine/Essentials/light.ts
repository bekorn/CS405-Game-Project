import M_Object from "../Object/M_Object.js";
import { mat4, vec3 } from "../Utility/GL/gl-matrix.js";
import { Controller } from "../Utility/controller.js";
import ShadowMap from "../Utility/shadow_map";

export default class Light extends M_Object {

    shadow_map : WebGLTexture;

    projection_matrix : mat4 = mat4.create();
    view_matrix : mat4 = mat4.create();

    view_projection_matrix : mat4 = mat4.create();

    width : number;
    height : number;
    far : number;

    //  Always points at origin
    target : vec3 = vec3.fromValues(0,0,0);
    
    constructor( pos : vec3, texture_width : number, texture_height : number, width : number, height : number, far : number ) {

        super();

        this.width = width;
        this.height = height;
        this.far = far;

        this.model.translate_global( pos );

        this.refresh_matrices();
    }

    refresh_matrices() {

        mat4.ortho( this.projection_matrix, -this.width, this.width, -this.height, this.height, 0, this.far );

        mat4.lookAt( this.view_matrix, this.model.global_position(), this.target, vec3.fromValues(0,1,0) );

        mat4.multiply( this.view_projection_matrix, this.projection_matrix, this.view_matrix );
    }

    update( delta_time ) {

        if (Controller.keys[ 'a' ].is_down == true) {
            this.model.rotate_globalY( -50 * delta_time );
        }
        if (Controller.keys[ 'd' ].is_down == true) {
            this.model.rotate_globalY( 50 * delta_time );
        }
        if (Controller.keys[ 'w' ].is_down == true) {
            this.model.translate(vec3.fromValues(0, 3 * delta_time, 0));
        }
        if (Controller.keys[ 's' ].is_down == true) {
            this.model.translate(vec3.fromValues(0, -3 * delta_time, 0));
        }

        // console.log( this.model.global_position() );
    }
}