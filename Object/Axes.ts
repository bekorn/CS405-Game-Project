import M_Object from "./M_Object.js";
import {glMatrix, mat4, vec3, quat} from "../Utility/GL/gl-matrix.js";
import RectangularPrism from "../Mesh/rectangular_prism.js";
import M_Shader from "../Utility/Shader/M_shader.js";

export default class Axes extends M_Object {

    constructor( shader: M_Shader, origin: vec3  ) {
        super( shader, origin );

        this.add_mesh( new RectangularPrism( this.shader, vec3.fromValues(100, 100, 100) ) );
        this.add_mesh( new RectangularPrism( this.shader, vec3.fromValues(350, 50, 50) ) );
        this.add_mesh( new RectangularPrism( this.shader, vec3.fromValues(50, 350, 50) ) );
        this.add_mesh( new RectangularPrism( this.shader, vec3.fromValues(50, 50, 350) ) );
    }

    update() {
        //  Rotate around self
        for (let mesh of this.meshes) {
            quat.rotateX( mesh.model.rotation, mesh.model.rotation, glMatrix.toRadian(2) );
        }

        //  Rotate around origin
        quat.rotateZ( this.model.rotation_g, this.model.rotation_g, glMatrix.toRadian( 0.5 ) );

        

        // console.log( this.id +"'s Translation => "+ vec3.str( mat4.getTranslation( vec3.create(), this.model ) ) );
    }
}