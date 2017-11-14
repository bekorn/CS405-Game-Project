import M_Shape from "../Shape/M_shape.js";
import {glMatrix, vec3, mat4} from "../Utility/GL/gl-matrix.js";
import M_Shader from "../Utility/Shader/M_shader.js";

export default abstract class M_Object {

    static id : number = 0;
    id : number = M_Object.id++;

    parent : M_Object = null;
    children: M_Object[] = [];
    drawable : M_Shape[] = [];

    shader : M_Shader;

    //  TODO: A model class is needed
    model : mat4 = mat4.create();
    origin: vec3;
    translation: vec3 = vec3.create();
    global_rotation: vec3 = vec3.create();
    self_rotation: vec3 = vec3.create();
    scale: vec3 = vec3.fromValues(1,1,1);
    scale_of_shapes : vec3 = vec3.fromValues(1,1,1);
    //  for all those transformations above

    constructor( shader: M_Shader, origin: vec3 ) {
        this.shader = shader;
        this.origin = origin;
    }

    add_child( obj: M_Object, relative_origin: vec3 = vec3.create() ) : void {

        vec3.add( obj.origin, obj.origin, relative_origin );

        mat4.translate( obj.model, obj.model, obj.origin );

        obj.parent = this;

        this.children.push( obj );
    }

    add_drawable( drawable_obj : M_Shape ) : void {
        this.drawable.push( drawable_obj );
    }

    move() : void {

    }

    collide() : void {

    }

    update() : void {

    }

    draw( parent_model: mat4 ) : void {

        // console.log( "Drawing OBJECT:"+ this.id );

        let model = mat4.create();
        mat4.multiply( model, parent_model, this.model );

        for( let child of this.children ) {
            child.draw( model );
        }

        mat4.scale( model, model, this.scale_of_shapes );
        // mat4.rotateX( model, model, this.self_rotation[0] );
        // mat4.rotateY( model, model, this.self_rotation[1] );
        // mat4.rotateZ( model, model, this.self_rotation[2] );

        for( let shape of this.drawable ) {
            shape.draw( model );
        }
    }

    scale_shapes( v3 : vec3 ) {
        vec3.multiply( this.scale_of_shapes, this.scale_of_shapes, v3 );
    }

    get_translation() : vec3 {
        return mat4.getTranslation( vec3.create(), this.model );
    }

    get_global_translation() : vec3 {
        if( this.parent !== null ) {

            return vec3.add( vec3.create(),
                this.get_translation(),
                this.parent.get_global_translation.bind( this.parent )()
            )
        }
        else {
            return this.get_translation();
        }
    }

    translate( v3 : vec3 ) {
        vec3.add( this.translation, this.translation, v3 );
        mat4.translate( this.model, this.model, v3 );
    }

    rotate_around_self( v3 : vec3 ) {
        vec3.add( this.self_rotation, this.self_rotation, v3 );
        // mat4.rotateX( this.model, this.model, v3[0] );
        // mat4.rotateY( this.model, this.model, v3[1] );
        // mat4.rotateZ( this.model, this.model, v3[2] );
    }



}