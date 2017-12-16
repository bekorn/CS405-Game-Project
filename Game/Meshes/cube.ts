import M_Mesh from "../../Engine/Mesh/M_Mesh.js";
import {vec3} from "../../Engine/Utility/GL/gl-matrix.js";
import M_Shader from "../../Engine/Shader/M_shader.js";
import MeshLoader from "../../Engine/Utility/mesh_loader.js";

export default class Cube extends M_Mesh {

    colour = vec3.fromValues( Math.random(), Math.random(), Math.random() );

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