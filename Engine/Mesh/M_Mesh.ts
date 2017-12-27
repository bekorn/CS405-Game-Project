import {vec3, mat4} from "../Utility/GL/gl-matrix.js";
import Model from "../Utility/model.js";
import M_Object from "../Object/M_Object.js";
import TextureLoader from "../Texture/texture_loader.js";
import AABB from "../Physics/AABB.js";

export default abstract class M_Mesh {

    static id : number = 0;
    id : number = M_Mesh.id++;

    parent : M_Object = null;
    model : Model = new Model( this );
    frame_model : mat4 = mat4.create();
    bbox : AABB = null;

    texture : WebGLTexture;

    //  Material Properties     //
    colour : vec3 = vec3.fromValues( 0.5, 0.5, 0.5 );
    specular : number = 256;
    //////////////////////////////


    constructor( texture : WebGLTexture = TextureLoader.loaded_textures[ TextureLoader.to_load[ 0 ][ 0 ] ] ) {

        this.texture = texture;
    }

    remove_self() {

        const index = this.parent.meshes.indexOf( this );
        this.parent.meshes.splice( index, 1 );
    }

    async refresh_model( parent_model : mat4 ) {
        // console.log( "Drawing SHAPE:"+ this.id );

        let model = mat4.clone( parent_model );

        mat4.multiply( this.frame_model, model, this.model.get_model() );
    };

    attach_bbox( dimensions : vec3 ) {

        this.bbox = new AABB( this.model.global_position(), dimensions );
    }

    update_bbox() {

        this.bbox.update_pos( this.model.global_position() );
    }
}