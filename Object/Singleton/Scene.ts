import M_Object from "../M_Object.js";
import {vec3, mat4} from "../../Utility/GL/gl-matrix.js";
import M_Shader from "../../Utility/Shader/M_shader.js";
import RectangularPrism from "../../Mesh/rectangular_prism.js";
import Model from "../../Utility/model.js";
import RootModel from "../../Utility/root_model.js";

export default class Scene extends M_Object {

    constructor( shader: M_Shader ) {
        super( shader );

        this.model.parent_model = new RootModel();

        // this.add_mesh( new RectangularPrism( shader, vec3.fromValues(1600, 10, 1600) ), vec3.fromValues( 0, -100, 0 ) );
    }

    draw() {
        //  Initializes draw tree with its own model
        const model = mat4.clone( this.model.get_model() );

        super.draw( model );
    }
}