import M_Object from "../../Engine/Object/M_Object.js";
import TextureLoader from "../../Engine/Texture/texture_loader.js";
import CubeMesh from "../Meshes/cube.js";
import { vec3 } from "../../Engine/Utility/GL/gl-matrix.js";
import M_Mesh from "../../Engine/Mesh/M_Mesh.js";

export default class Hall extends M_Object {

    floor : M_Mesh;
    ceiling : M_Mesh;
    left : M_Mesh;
    right : M_Mesh;

    constructor(  width : number, height : number, length : number ) {
        super();

        this.floor = this.add_mesh( new CubeMesh( vec3.fromValues( width * 3, height, length ) ) );
        this.floor.texture = TextureLoader.loaded_textures[ 'simple' ];
        this.floor.model.translate_global( vec3.fromValues( 0, -height * 2, 0 ) );

        this.ceiling = this.add_mesh( new CubeMesh( vec3.fromValues( width * 3, height, length ) ) );
        this.ceiling.texture = TextureLoader.loaded_textures[ 'simple' ];
        this.ceiling.model.translate_global( vec3.fromValues( 0, height * 2, 0 ) );

        this.left = this.add_mesh( new CubeMesh( vec3.fromValues( width, height, length ) ) );
        this.left.texture = TextureLoader.loaded_textures[ 'simple' ];
        this.left.model.translate_global( vec3.fromValues( width * 2, 0, 0 ) );

        this.right = this.add_mesh( new CubeMesh( vec3.fromValues( width, height, length ) ) );
        this.right.texture = TextureLoader.loaded_textures[ 'simple' ];
        this.right.model.translate_global( vec3.fromValues( -width * 2, 0, 0 ) );
    }
}