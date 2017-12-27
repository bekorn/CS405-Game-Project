import {glMatrix, vec3, mat4, quat} from "./GL/gl-matrix.js";
import M_Object from "../Object/M_Object.js";
import M_Mesh from "../Mesh/M_Mesh.js";

/*
    Multiplying from left is local,
    Multiplying from right is global
*/

export default class Model {

    belongs_to : M_Object | M_Mesh | null;
    parent_model : Model;
    updated : boolean = true;
    model : mat4;

    //  Local
    translation : vec3 = vec3.fromValues(0,0,0);
    rotation : quat = quat.fromEuler( quat.create(),0,0,0);
    scale : vec3 = vec3.fromValues(1,1,1);

    //  Global (relative to parent)
    global_rotation : quat = quat.fromEuler( quat.create(),0,0,0);

    constructor( obj : M_Object | M_Mesh | null ) {

        if( obj != null ) {

            this.belongs_to = obj;
            this.parent_model = obj.model;
        }
    }

    get_model() : mat4 {
        // console.log( this.belongs_to, this.belongs_to.parent );

        if( ! this.updated ) {
            return this.model;
        }


        //  Result model is: Scale * GlobalRot * Transition * Rotation * Identity

        let model = mat4.create();

        mat4.fromRotationTranslationScale( model, this.rotation, this.translation, vec3.fromValues(1,1,1) );

        //  Translate around parent
        mat4.translate( model, model, vec3.negate( vec3.create(), this.translation ) );
        mat4.multiply( model, model, mat4.fromQuat(mat4.create(), this.global_rotation ) );
        mat4.scale( model, model, this.scale );
        mat4.translate( model, model, this.translation );

/*        mat4.multiply( model, mat4.fromQuat(mat4.create(), this.rotation), model );

        //  Translate around parent
        mat4.translate( model, model, this.translation );
        // mat4.multiply( model, mat4.fromQuat(mat4.create(), this.global_rotation), model );
        mat4.scale( model, model, this.scale );*/

        this.model = model;
        this.updated = false;

        return model;
    }

    // get_model() : mat4 {
    //     // console.log( this.belongs_to, this.belongs_to.parent );
    //
    //     const local = mat4.create();
    //     const rotation = mat4.fromQuat( mat4.create(), quat.fromEuler( quat.create(), this.rotation[0], this.rotation[1], this.rotation[2] ) );
    //     const scale = mat4.fromScaling( mat4.create(), this.scale );
    //
    //     mat4.multiply( local, rotation, scale );
    //
    //
    //     const global = mat4.create();
    //     const translation = mat4.fromTranslation( mat4.create(), this.translation_g );
    //     const rotation_g = mat4.fromQuat( mat4.create(), quat.fromEuler( quat.create(), this.rotation_g[0], this.rotation_g[1], this.rotation_g[2] ) );
    //
    //     return mat4.multiply( mat4.create(), local, global );
    // }

    translate( v3 : vec3 ) {

        let relative_scale : vec3 = vec3.create();
        vec3.multiply( relative_scale, this.scale, this.parent_model.get_scale() );

        const relative_dist = vec3.fromValues( 0, 0,0 );
        vec3.transformMat4( relative_dist, v3, mat4.fromQuat(mat4.create(), this.rotation) );

        vec3.divide( v3, relative_dist, relative_scale );

        vec3.add( this.translation, this.translation, relative_dist );

        this.updated = true;
    }

    translate_global( v3 : vec3 ) {

        let relative_scale : vec3 = vec3.create();
        vec3.multiply( relative_scale, this.scale, this.parent_model.get_scale() );

        vec3.divide( v3, v3, relative_scale );

        vec3.add( this.translation, this.translation, v3 );

        this.updated = true;
    }

    get_scale() : vec3 {

        return vec3.multiply( vec3.create(), this.scale, this.parent_model.get_scale() );
    }

    scale_up( scale : number ) {
        vec3.scale( this.scale, this.scale, scale );

        this.updated = true;
    }

    scale_v3_up( v3 : vec3 ) {
        vec3.multiply( this.scale, this.scale, v3 );

        this.updated = true;
    }

    scale_down( scale : number ) {
        vec3.scale( this.scale, this.scale, 1 / scale );

        this.updated = true;
    }

    static rotate_quat( q : quat, v3 : vec3 ) {

        if( v3[0] != 0 ) {
            quat.rotateX( q, q, glMatrix.toRadian(v3[0]) );
        }

        if( v3[1] != 0 ) {
            quat.rotateY( q, q, glMatrix.toRadian(v3[1]) );
        }

        if( v3[2] != 0 ) {
            quat.rotateZ( q, q, glMatrix.toRadian(v3[2]) );
        }
    }

    rotate( v3 : vec3 ) {
        Model.rotate_quat( this.rotation, v3 );

        this.updated = true;
    }

    rotateX( degree : number ) {
        quat.rotateX( this.rotation, this.rotation, glMatrix.toRadian( degree ) );

        this.updated = true;
    }

    rotateY( degree : number ) {
        quat.rotateY( this.rotation, this.rotation, glMatrix.toRadian( degree ) );

        this.updated = true;
    }

    rotateZ( degree : number ) {
        quat.rotateZ( this.rotation, this.rotation, glMatrix.toRadian( degree ) );

        this.updated = true;
    }

    rotate_global( v3 : vec3 ) {
        Model.rotate_quat( this.global_rotation, v3 );

        this.updated = true;
    }

    rotate_globalX( degree : number ) {
        quat.rotateX( this.global_rotation, this.global_rotation, glMatrix.toRadian( degree ) );

        this.updated = true;
    }

    rotate_globalY( degree : number ) {
        quat.rotateY( this.global_rotation, this.global_rotation, glMatrix.toRadian( degree ) );

        this.updated = true;
    }

    rotate_globalZ( degree : number ) {
        quat.rotateZ( this.global_rotation, this.global_rotation, glMatrix.toRadian( degree ) );

        this.updated = true;
    }

    global_position() : vec3 {

        let relative_to_parent = vec3.transformMat4( vec3.fromValues(0,0,0), vec3.fromValues(0,0,0), this.get_model() );
        vec3.multiply( relative_to_parent, relative_to_parent, this.parent_model.get_scale() );

        return vec3.add( relative_to_parent, relative_to_parent, this.parent_model.global_position() );
    }
}