import M_Object from "../../Engine/Object/M_Object.js";
import TextureLoader from "../../Engine/Texture/texture_loader.js";
import CubeMesh from "../Meshes/cube.js";
import { vec3 } from "../../Engine/Utility/GL/gl-matrix.js";
import M_Mesh from "../../Engine/Mesh/M_Mesh.js";

export default class Hall extends M_Object {

    width : number;
    height : number;
    length : number;

    floor : M_Mesh;
    ceiling : M_Mesh;
    left : M_Mesh;
    right : M_Mesh;

    constructor(  width : number, height : number, length : number ) {
        super();

        this.width = width;
        this.height = height;
        this.length = length;

        this.floor = this.add_wall( vec3.fromValues( width * 3, height, length ), vec3.fromValues( 0, -height * 2, 0 ) );
        this.floor.texture = TextureLoader.loaded_textures[ 'Wooden Floor' ];

        this.ceiling = this.add_wall( vec3.fromValues( width * 3, height, length ), vec3.fromValues( 0, height * 2, 0 ) );
        this.ceiling.texture = TextureLoader.loaded_textures[ 'Wooden Floor' ];

        this.left = this.add_wall( vec3.fromValues( width, height, length ) , vec3.fromValues( width * 2, 0, 0 ) );
        this.left.texture = TextureLoader.loaded_textures[ 'Brick Wall' ];

        this.right = this.add_wall( vec3.fromValues( width, height, length ), vec3.fromValues( -width * 2, 0, 0 ) );
        this.right.texture = TextureLoader.loaded_textures[ 'Brick Wall' ];
    }

    add_wall( dimensions : vec3, pos : vec3 ) : M_Mesh {

        const wall = this.add_mesh( new CubeMesh( dimensions ) );
        wall.model.translate_global( pos );

        wall.attach_bbox( dimensions );

        return wall;
    }
}