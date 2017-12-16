import Model from "./model.js";
import { vec3 } from "./GL/gl-matrix.js";

export default class RootModel extends Model {

    constructor() {
        super( {model: null} );

        this.scale = vec3.fromValues(1,1,1);
    }

    global_position() {

        return vec3.fromValues(0,0,0);
    }

    get_scale() {

        return vec3.fromValues( 1,1,1 );
    }
}