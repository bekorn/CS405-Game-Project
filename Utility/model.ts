import {glMatrix, vec3, mat4, quat} from "./GL/gl-matrix.js";
import M_Object from "../Object/M_Object";

/*
    Multiplying from left is local,
    Multiplying from right is global
*/

export default class Model {

    belongs_to : any;

    //  Local
    origin : vec3 = vec3.fromValues(0,0,0);
    rotation : quat = quat.fromEuler( quat.create(),0,0,0);
    scale : vec3 = vec3.fromValues(1,1,1);

    //  Global (relative to parent)
    translation_g : vec3 = vec3.fromValues(0,0,0);
    rotation_g : quat = quat.fromEuler( quat.create(),0,0,0);

    //  Parent
    origin_p : vec3 = vec3.fromValues(0,0,0);
    scale_p : vec3 = vec3.fromValues(1,1,1);

    constructor( obj : any ) {
        this.belongs_to = obj;
    }

    get_model() : mat4 {
        // console.log( this.belongs_to, this.belongs_to.parent );

        const local = mat4.create();
        mat4.fromRotationTranslationScaleOrigin( local, this.rotation, this.translation_g, vec3.fromValues(1,1,1), this.origin );

        const global = mat4.create();
        mat4.fromRotationTranslationScaleOrigin( global, this.rotation_g, vec3.fromValues(0,0,0), this.scale, this.origin_p );

        return mat4.multiply( mat4.create(), local, global );
    }

    get_model_qwe() : mat4 {
        // console.log( this.belongs_to, this.belongs_to.parent );

        const local = mat4.create();
        const rotation = mat4.fromQuat( mat4.create(), quat.fromEuler( quat.create(), this.rotation[0], this.rotation[1], this.rotation[2] ) );
        const scale = mat4.fromScaling( mat4.create(), this.scale );

        mat4.multiply( local, rotation, scale );


        const global = mat4.create();
        const translation = mat4.fromTranslation( mat4.create(), this.translation_g );
        const rotation_g = mat4.fromQuat( mat4.create(), quat.fromEuler( quat.create(), this.rotation_g[0], this.rotation_g[1], this.rotation_g[2] ) );

        return mat4.multiply( mat4.create(), local, global );
    }

    translate( v3 : vec3 )
    {
        let relative : vec3 = vec3.create();
        // vec3.divide( relative, v3, this.scale_p );
        vec3.add( this.translation_g, this.translation_g, v3 );

        vec3.add(this.origin, this.origin, v3);
        //
        // vec3.add( this.translation_g, this.translation_g, v3 );
    }
}