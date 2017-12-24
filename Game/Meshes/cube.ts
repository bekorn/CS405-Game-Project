import M_Mesh from "../../Engine/Mesh/M_Mesh.js";
import {vec3} from "../../Engine/Utility/GL/gl-matrix.js";
import MeshLoader from "../../Engine/Mesh/mesh_loader.js";
import TextureLoader from "../../Engine/Texture/texture_loader.js";
import M_Object from "../../Engine/Object/M_Object";


export default class CubeMesh extends M_Mesh {

    static instance_list : CubeMesh[] = [];

    static vao() {

        return MeshLoader.loaded_meshes[ 'cube' ];
    }

    colour = vec3.fromValues( Math.random(), Math.random(), Math.random() );
    texture : WebGLTexture = TextureLoader.loaded_textures[ TextureLoader.to_load[ Math.round( Math.random() * 2 ) ][ 0 ] ];


    constructor( dimensions : vec3 ) {

        super();

        this.model.scale_v3_up( dimensions );

        CubeMesh.instance_list.push( this );
    }
}