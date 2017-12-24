import M_Object from "../Object/M_Object.js";
import {vec3, mat4} from "../Utility/GL/gl-matrix.js";
import M_Shader from "../Shader/M_shader.js";
import RootModel from "../Utility/root_model.js";
import DeerMesh from "../../Game/Meshes/deer.js";

export default class Scene extends M_Object {

    constructor() {
        super( null );

        this.model.parent_model = new RootModel();

        // this.add_mesh( new CubeMesh( shader, vec3.fromValues(1600, 10, 1600) ), vec3.fromValues( 0, -100, 0 ) );
    }

    update() {

        // for( const mesh of this.meshes ) {
        //     mesh.model.rotateY( 1 );
        // }
    }

    async refresh_model() {
        //  Initializes refresh_model tree with its own model
        const model = mat4.clone( this.model.get_model() );

        return super.refresh_model( model );
    }
}