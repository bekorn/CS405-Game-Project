import { vec3, mat4 } from "../Utility/GL/gl-matrix.js";
import M_Object from "../Object/M_Object.js";
import RootModel from "../Utility/root_model.js";
import { ui } from "../engine.js";

export default class UI extends M_Object {

    constructor( parent : M_Object = ui ) {

        super( parent );

        if( parent == null ) {

            this.model.parent_model = new RootModel();
        }
    }

    async refresh_model() {
        //  Initializes refresh_model tree with its own model
        const model = mat4.clone( this.model.get_model() );

        return super.refresh_model( model );
    }
}


