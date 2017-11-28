import M_Object from "../M_Object.js";
import {vec3, mat4} from "../../Utility/GL/gl-matrix.js";
import {Controller} from "../../Utility/Controller.js";

export default class Camera extends M_Object {

    view_matrix : mat4 = mat4.create();
    following : M_Object = null;
    target : vec3;

    constructor( eye : vec3, target: vec3 ) {
        super( null, eye );

        this.target = target;

        mat4.lookAt( this.view_matrix, eye, target, vec3.fromValues(0,1,0) );
    }

    follow( obj : M_Object ) : void {
        this.following = obj;
    }

    update() : void {
        if( this.following ) {
            this.target = this.following.model.translation_g;
        }

        mat4.lookAt( this.view_matrix, this.model.origin, this.target, vec3.fromValues(0,1,0) );

        if(Controller.left==true)
        {this.model.translate(vec3.fromValues(-10, 0,0))}
        if(Controller.up==true)
        {this.model.translate(vec3.fromValues(0, 10,0))}
        if(Controller.right==true)
        {this.model.translate(vec3.fromValues(10, 0,0))}
        if(Controller.down==true)
        {this.model.translate(vec3.fromValues(0, -10,0))}

        console.log(this.view_matrix)
    }
}