import M_Object from "./M_object.js";
import {glMatrix, mat4, vec3} from "../Utility/GL/gl-matrix.js";
import RectangularPrism from "../Shape/rectangular_prism.js";
import M_Shader from "../Utility/Shader/M_shader.js";

export default class Axes extends M_Object {

    constructor( shader: M_Shader, origin: vec3  ) {
        super( shader, origin );

        this.add_drawable( new RectangularPrism( this.shader, vec3.fromValues(100, 100, 100) ) );
        this.add_drawable( new RectangularPrism( this.shader, vec3.fromValues(350, 50, 50) ) );
        this.add_drawable( new RectangularPrism( this.shader, vec3.fromValues(50, 350, 50) ) );
        this.add_drawable( new RectangularPrism( this.shader, vec3.fromValues(50, 50, 350) ) );
    }

    update() {
        //  Rotate around self
        // mat4.multiply( this.model, this.model, mat4.fromXRotation( mat4.create(), glMatrix.toRadian(0.5) ) );
        for( const shape of this.drawable ) {
            mat4.multiply( shape.model, shape.model, mat4.fromXRotation( mat4.create(), glMatrix.toRadian(2) ) );
        }
        //  Rotate around origin
        mat4.multiply( this.model, mat4.fromZRotation( mat4.create(), glMatrix.toRadian(0.5) ), this.model );

        // console.log( this.id +"'s Translation => "+ vec3.str( mat4.getTranslation( vec3.create(), this.model ) ) );
    }
}