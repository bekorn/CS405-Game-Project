import MeshLoader from "../../Engine/Mesh/mesh_loader.js";
import { vec3 } from "../../Engine/Utility/GL/gl-matrix.js";
import M_Mesh from "../../Engine/Mesh/M_Mesh.js";
import M_Shader from "../../Engine/Shader/M_shader.js";

export default class DeerMesh extends M_Mesh {

    colour = vec3.fromValues( 0.423529412, 0.956862745, 0.274509804 );
    specular = 128;

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

    uvmap() : Float32Array {
        return new Float32Array(
            MeshLoader.loaded_meshes[ "deer" ][ "meshes" ][ 0 ][ "texturecoords" ][ 0 ]
        );
    }

    constructor( shader : M_Shader, dimensions : vec3 ) {

        super( shader );

        this.init_mesh();

        this.model.scale_v3_up( dimensions );
    }
}