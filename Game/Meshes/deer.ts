import MeshLoader from "../../Engine/Mesh/mesh_loader.js";
import { vec3 } from "../../Engine/Utility/GL/gl-matrix.js";
import M_Mesh from "../../Engine/Mesh/M_Mesh.js";
import M_Shader from "../../Engine/Shader/M_shader.js";

export default class DeerMesh extends M_Mesh {

    colour = vec3.fromValues( 0.423529412, 0.956862745, 0.274509804 );
    specular = 128;


    static vao = MeshLoader.loaded_meshes[ 'deer' ];

    static instance_list : DeerMesh[] = [];

    constructor( dimensions : vec3 ) {

        super( DeerMesh );

        this.model.scale_v3_up( dimensions );
    }
}