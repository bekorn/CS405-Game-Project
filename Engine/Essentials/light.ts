import M_Object from "../Object/M_Object.js";
import { mat4, vec3 } from "../Utility/GL/gl-matrix.js";
import { Controller } from "../Utility/controller.js";
import ShadowMap from "../Utility/shadow_map";

export default class Light extends M_Object {

    shadow_map : WebGLTexture;

    projection_matrix : mat4 = mat4.create();
    view_matrix : mat4 = mat4.create();

    view_projection_matrix : mat4 = mat4.create();

    //  Always points at origin
    target : vec3 = vec3.fromValues(0,0,0);
    
    constructor( v3 : vec3, texture_width : number, texture_height : number  ) {
        super();

        this.model.translate_global( v3 );

        this.refresh_matrices( texture_width , texture_height );
    }

    refresh_matrices( texture_width : number, texture_height : number ) {

        mat4.ortho( this.projection_matrix, -texture_width / 2, texture_width / 2, -texture_height / 2, texture_height / 2, 0, 500 );

        mat4.lookAt( this.view_matrix, this.model.global_position(), this.target, vec3.fromValues(0,1,0) );

        mat4.multiply( this.view_projection_matrix, this.projection_matrix, this.view_matrix );
    }

    update() {

        if (Controller.a == true) {
            this.model.rotate_globalY( -1 );
        }
        if (Controller.d == true) {
            this.model.rotate_globalY( 1 );
        }
        if (Controller.w == true) {
            this.model.translate(vec3.fromValues(0, 6, 0));
        }
        if (Controller.s == true) {
            this.model.translate(vec3.fromValues(0, -6, 0));
        }

        // console.log( this.model.global_position() );
    }
}