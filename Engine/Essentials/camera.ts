import M_Object from "../Object/M_Object.js";
import {vec3, mat4} from "../Utility/GL/gl-matrix.js";
import {Controller} from "../Utility/controller.js";

export default class Camera extends M_Object {

    view_matrix : mat4 = mat4.create();
    following : M_Object = null;
    target : vec3;
    dist : vec3 = vec3.fromValues( 400, 400, 500 );

    constructor( eye : vec3, target: vec3) {
        super( null );

        this.target = target;
        mat4.lookAt( this.view_matrix, eye, target, vec3.fromValues(0,1,0) );

        // const self_pos = vec3.add( vec3.fromValues(0,0,0), target, this.dist );
        // mat4.lookAt( this.view_matrix, self_pos, target, vec3.fromValues(0,1,0) );
    }

    follow( obj : M_Object ) : void {
        this.following = obj;
    }

    update() : void {
        if( this.following ) {
            this.target = this.following.model.global_position();
        }

        // const pos = this.model.global_position();
        // mat4.lookAt( this.view_matrix, pos, vec3.add( vec3.fromValues(0,0,0), this.target, vec3.fromValues(0,pos[1]-200,0) ), vec3.fromValues(0,1,0) );

        mat4.lookAt( this.view_matrix, this.model.global_position(), this.target, vec3.fromValues(0,1,0) );

        // const self_pos = vec3.add( vec3.fromValues(0,0,0), this.target, this.dist );
        // mat4.lookAt( this.view_matrix, self_pos, this.target, vec3.fromValues(0,1,0) );

        if (Controller.left == true) {
            this.model.rotate_globalY( -1 );
        }
        if (Controller.right == true) {
            this.model.rotate_globalY( 1 );
        }
        if (Controller.up == true) {
            this.model.translate(vec3.fromValues(0, 6, 0));
        }
        if (Controller.down == true) {
            this.model.translate(vec3.fromValues(0, -6, 0));
        }
    }
}