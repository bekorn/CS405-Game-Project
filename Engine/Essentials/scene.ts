import M_Object from "../Object/M_Object.js";
import {vec3, mat4} from "../Utility/GL/gl-matrix.js";
import M_Shader from "../Shader/M_shader.js";
import RootModel from "../Utility/root_model.js";
import DeerMesh from "../Mesh/deer.js";

export default class Scene extends M_Object {

    constructor( shader: M_Shader ) {
        super( shader, null );

        this.model.parent_model = new RootModel();

        // this.add_mesh( new Cube( shader, vec3.fromValues(1600, 10, 1600) ), vec3.fromValues( 0, -100, 0 ) );

        this.add_mesh( new DeerMesh( shader, vec3.fromValues(0.16, 0.16, 0.16) ) );
    }

    update() {

        for( const mesh of this.meshes ) {
            mesh.model.rotateY( 1 );
        }
    }

    async draw() {
        //  Initializes draw tree with its own model
        const model = mat4.clone( this.model.get_model() );

        return super.draw( model );
    }
}