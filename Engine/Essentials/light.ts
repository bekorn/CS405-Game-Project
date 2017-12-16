import M_Object from "../Object/M_Object.js";

export default class Light extends M_Object {

    constructor( v3 : vec3 ) {
        super( null );

        this.model.translate_global( v3 );
    }
}