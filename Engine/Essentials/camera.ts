import M_Object from "../Object/M_Object.js";
import {vec3, mat4, glMatrix} from "../Utility/GL/gl-matrix.js";
import {Controller} from "../Utility/controller.js";

export default class Camera extends M_Object {

    projection_matrix : mat4;
    view_matrix : mat4 = mat4.create();
    following : M_Object = null;
    target : vec3;
    near : number;
    far : number;

    constructor( eye : vec3, target: vec3, ratio : number, near : number, far : number ) {
        super();

        this.near = near;
        this.far = far;
        //  Create the projection matrix of the camera
        this.projection_matrix = mat4.perspective( mat4.create(), glMatrix.toRadian(36), ratio, near, far );

        this.target = target;
        mat4.lookAt( this.view_matrix, eye, target, vec3.fromValues(0,1,0) );

        // const self_pos = vec3.add( vec3.fromValues(0,0,0), target, this.dist );
        // mat4.lookAt( this.view_matrix, self_pos, target, vec3.fromValues(0,1,0) );
    }

    follow( obj : M_Object ) : void {
        this.following = obj;
    }

    unfollow() {
        this.following = null;
    }

    update( delta_time ) : void {
        if( this.following ) {
            this.target = this.following.model.global_position();
        }

        // const corrected_up = vec3.transformQuat( vec3.fromValues(0,0,0), vec3.fromValues(0,1,0), this.model.rotation );
        const corrected_up = vec3.fromValues(0,1,0);
        mat4.lookAt( this.view_matrix, this.model.global_position(), this.target, corrected_up );

        if( Controller.keys[ 'e' ].is_down ) {
            this.model.translate(vec3.fromValues(0, 0, -20 * delta_time));
        }
        if( Controller.keys[ 'q' ].is_down ) {
            this.model.translate(vec3.fromValues(0, 0, 20 * delta_time));
        }
    }
}