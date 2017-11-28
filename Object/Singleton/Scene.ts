import M_Object from "../M_Object.js";
import {vec3, mat4} from "../../Utility/GL/gl-matrix.js";
import M_Shader from "../../Utility/Shader/M_shader.js";

export default class Scene extends M_Object {

    constructor( shader: M_Shader, origin: vec3 ) {
        super( shader, origin );

        this.model.origin = origin;
        this.model.origin_p = vec3.fromValues(0,0,0);
        this.model.scale_p = vec3.fromValues(1,1,1);
    }

    draw( view_matrix : mat4 ) {

        const model = mat4.clone( view_matrix );

        super.draw( model );
    }
}