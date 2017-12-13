import M_Mesh from "./M_Mesh.js";
import {glMatrix, vec3, mat4} from "../Utility/GL/gl-matrix.js";
import M_Shader from "../Utility/Shader/M_shader.js";
import {gl, camera, projection_matrix} from "../game.js";

export default class RectangularPrism extends M_Mesh {

    vertices(): Float32Array {
        return new Float32Array(
            [ 1,  -1,  -1,  1,  -1,  1,  -1,  -1,  1,  -1,  -1,  -1,  1,  1,  -1,  -1,  1,  -1,  -1,  1,  1,  1,  1,  1,  1,  -1,  -1,  1,  1,  -1,  1,  1,  1,  1,  -1,  1,  1,  -1,  1,  1,  1,  1,  -1,  1,  1,  -1,  -1,  1,  -1,  -1,  1,  -1,  1,  1,  -1,  1,  -1,  -1,  -1,  -1,  1,  1,  -1,  1,  -1,  -1,  -1,  -1,  -1,  -1,  1,  -1 ]
        );
    }

    faces(): Uint16Array {
        return new Uint16Array(
            [ 0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23 ]
        );
    }

    normals(): Float32Array {
        return new Float32Array(
            [ 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -0, -0, 1, -0, -0, 1, -0, -0, 1, -0, -0, 1, -1, -0, -0, -1, -0, -0, -1, -0, -0, -1, -0, -0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1 ]
        );
    };

    constructor( shader : M_Shader, dimensions : vec3 ) {

        super( shader );

        this.init_mesh();

        this.model.scale_v3_up( dimensions );
    }

    draw( parent_model : mat4 ) {

        super.draw( parent_model );
    }
}