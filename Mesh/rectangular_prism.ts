import M_Mesh from "./M_Mesh.js";
import {glMatrix, vec3, mat4} from "../Utility/GL/gl-matrix.js";
import M_Shader from "../Utility/Shader/M_shader.js";
import {gl, camera, projection_matrix} from "../game.js";
import MeshLoader from "../Assets/mesh_loader.js";

export default class RectangularPrism extends M_Mesh {

    vertices(): Float32Array {
        return new Float32Array(
            MeshLoader.loaded_meshes[ "cube" ][ "meshes" ][ 0 ][ "vertices" ]
        );
    }

    faces(): Uint16Array {
        return new Uint16Array(
            MeshLoader.flatten( MeshLoader.loaded_meshes[ "cube" ][ "meshes" ][ 0 ][ "faces" ] )
        );
    }

    normals(): Float32Array {
        return new Float32Array(
            MeshLoader.loaded_meshes[ "cube" ][ "meshes" ][ 0 ][ "normals" ]
        );
    };

    constructor( shader : M_Shader, dimensions : vec3 ) {

        super( shader );

        this.init_mesh();

        this.model.scale_v3_up( dimensions );
    }
}