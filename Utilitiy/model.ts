import {glMatrix, vec3, mat4, quat} from "../Utilitiy/GL/gl-matrix.js";
import M_Object from "../Object/M_object";

/*
    Multiplying from left is local,
    Multiplying from right is global
 */

export default class Model {

    belongs_to : M_Object;

    origin: vec3;

    translation_L: vec3 = vec3.create();
    rotation_L: vec3 = vec3.create();
    scale_L: vec3 = vec3.fromValues(1,1,1);

    translation_G: vec3 = vec3.create();
    rotation_G: vec3 = vec3.create();
    scale_G: vec3 = vec3.fromValues(1,1,1);

    rotate_around_self_X( angle : number ) {
        this.self_rotation[0] += angle;

        mat4.fromRotationTranslationScaleOrigin()

        mat4.rotateX( this.model, this.model, angle );
    }

    rotate_around_self_Y( angle : number ) {
        this.self_rotation[1] += angle;
        mat4.rotateY( this.model, this.model, angle );
    }

    rotate_around_self_Z( angle : number ) {
        this.self_rotation[2] += angle;
        mat4.rotateZ( this.model, this.model, angle );
    }

    rotate_around_global( v3 : vec3 ) {
        vec3.add( this.global_rotation, this.global_rotation, v3 );
        //  this.model * RotationX * RotationY * RotationZ
        mat4.multiply( this.model,
            mat4.multiply( mat4.create(),
                this.model,
                mat4.fromXRotation( mat4.create(), v3[0] )
            ),
            mat4.multiply( mat4.create(),
                mat4.fromYRotation( mat4.create(), v3[1] ),
                mat4.fromZRotation( mat4.create(), v3[2] )
            )
        );
    }

    rotate_around_global_X( angle : number ) {
        this.global_rotation[0] += angle;
        mat4.rotateX( this.model, this.model, angle );
    }

    rotate_around_global_Y( angle : number ) {
        this.global_rotation[1] += angle;
        mat4.rotateY( this.model, this.model, angle );
    }

    rotate_around_global_Z( angle : number ) {
        this.global_rotation[2] += angle;
        mat4.rotateZ( this.model, this.model, angle );
    }
}