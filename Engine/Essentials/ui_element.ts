import { vec3, vec2 } from "../Utility/GL/gl-matrix.js";
import M_Mesh from "../Mesh/M_Mesh.js";
import MeshLoader from "../Mesh/mesh_loader.js";
import { ui } from "../engine.js";
import M_Object from "../Object/M_Object.js";
import UI from "./ui.js";

export default class UIElement extends M_Mesh {

    static instance_list : UIElement[] = [];

    visible : boolean = true;

    static vao() {

        return MeshLoader.loaded_meshes[ 'plane' ];
    };

    constructor( pos : number[], scale : number[], depth : number, texture : WebGLTexture, parent : UI | M_Object = ui ) {

        super( texture );

        UIElement.instance_list.push( this );

        parent.add_mesh( this );

        this.model.scale_v3_up( vec3.fromValues( scale[0], scale[1], 1.0 ) );

        this.model.translate_global( vec3.fromValues( pos[0], pos[1], depth ) );
    }

    toggle_visibility() {

        this.model.rotateY( 180 );

        this.visible = ! this.visible;
    }

    hide() {
        if( this.visible ) {

            this.toggle_visibility();
        }
    }

    show() {
        if( this.visible ) {

            this.toggle_visibility();
        }
    }

}