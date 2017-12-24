import M_Object from "../../Engine/Object/M_Object.js";
import { vec3 } from "../../Engine/Utility/GL/gl-matrix.js";
import RectangularPrism from "../Meshes/cube.js";
import M_Shader from "../../Engine/Shader/M_shader.js";

export default class Axes extends M_Object {

    constructor( parent : M_Object ) {
        super( parent );

        this.add_mesh( new RectangularPrism( vec3.fromValues(100, 100, 100) ) );
        this.add_mesh( new RectangularPrism( vec3.fromValues(350, 50, 50) ) );
        this.add_mesh( new RectangularPrism( vec3.fromValues(50, 350, 50) ) );
        this.add_mesh( new RectangularPrism( vec3.fromValues(50, 50, 350) ) );
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