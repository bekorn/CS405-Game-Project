import M_Object from "./M_Object.js";
import { vec3 } from "../Utility/GL/gl-matrix.js";
import RectangularPrism from "../Mesh/cube.js";
import M_Shader from "../Shader/M_shader.js";

export default class Axes extends M_Object {

    constructor( shader: M_Shader, parent : M_Object ) {
        super( shader, parent );

        this.add_mesh( new RectangularPrism( this.shader, vec3.fromValues(100, 100, 100) ) );
        this.add_mesh( new RectangularPrism( this.shader, vec3.fromValues(350, 50, 50) ) );
        this.add_mesh( new RectangularPrism( this.shader, vec3.fromValues(50, 350, 50) ) );
        this.add_mesh( new RectangularPrism( this.shader, vec3.fromValues(50, 50, 350) ) );
    }

    update() {
        //  Rotate around self
        for (let mesh of this.meshes) {
            mesh.model.rotateX( 2 );
        }

        //  Rotate around origin
        this.model.rotate_globalZ( 0.5 );

        // console.log( this.id +"'s Origin => "+ vec3.str( this.model.global_position() ) );
    }
}