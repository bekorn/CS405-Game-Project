import MeshLoader from "../Assets/mesh_loader.js";
import { vec3 } from "../Utility/GL/gl-matrix.js";
import M_Mesh from "./M_Mesh.js";
import M_Shader from "../Utility/Shader/M_shader.js";

export default class DeerMesh extends M_Mesh {

    vertices(): Float32Array {
        return new Float32Array(
            MeshLoader.loaded_meshes[ "deer" ][ "meshes" ][ 0 ][ "vertices" ]
        );
    }

    faces(): Uint16Array {
        return new Uint16Array(
            MeshLoader.flatten( MeshLoader.loaded_meshes[ "deer" ][ "meshes" ][ 0 ][ "faces" ] )
        );
    }

    normals(): Float32Array {
        return new Float32Array(
            MeshLoader.loaded_meshes[ "deer" ][ "meshes" ][ 0 ][ "normals" ]
        );
    };

    constructor( shader : M_Shader, dimensions : vec3 ) {

        super( shader );

        this.init_mesh();

        this.model.scale_v3_up( dimensions );
    }
}