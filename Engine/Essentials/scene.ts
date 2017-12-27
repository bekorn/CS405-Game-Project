import M_Object from "../Object/M_Object.js";
import { mat4 } from "../Utility/GL/gl-matrix.js";
import RootModel from "../Utility/root_model.js";

export default class Scene extends M_Object {

    constructor() {
        super( null );

        this.model.parent_model = new RootModel();
    }

    async refresh_model() {
        //  Initializes refresh_model tree with its own model
        const model = mat4.clone( this.model.get_model() );

        return super.refresh_model( model );
    }
}