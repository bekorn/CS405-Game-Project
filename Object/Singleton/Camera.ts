import M_Object from "../M_object.js";
import {vec3, mat4} from "../../Utility/GL/gl-matrix.js";

export default class Camera extends M_Object {

    view_matrix : mat4 = mat4.create();
    following : M_Object = null;

    constructor( eye : vec3, target: vec3 ) {
        super( null, eye );

        mat4.lookAt( this.view_matrix, eye, target, vec3.fromValues(0,1,0) );
    }

    follow( obj : M_Object ) : void {
        this.following = obj;
    }

    update() : void {
        if( this.following ) {
            const target : vec3 = this.following.get_global_translation();
            mat4.lookAt( this.view_matrix, this.origin, target, vec3.fromValues(0,1,0) );
        }
    }
}