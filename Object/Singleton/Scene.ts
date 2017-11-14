import M_Object from "../M_Object.js";
import {vec3, mat4} from "../../Utility/GL/gl-matrix.js";
import M_Shader from "../../Utility/Shader/M_shader.js";

export default class Scene extends M_Object {

    constructor( shader: M_Shader, origin: vec3 ) {
        super( shader, origin );
        mat4.translate( this.model, this.model, this.origin );
    }

    draw( view_matrix : mat4 ) {
        super.draw( mat4.clone( view_matrix ) );
    }
}