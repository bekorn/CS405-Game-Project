import M_Object from "../../Engine/Object/M_Object.js";
import CubeMesh from "../Meshes/cube.js";
import { vec3 } from '../../Engine/Utility/GL/gl-matrix.js';

export default class Cube extends M_Object {

    private speed : number;

    constructor( shader, scale, dist, speed ) {

        super( shader );

        this.model.translate_global( vec3.fromValues( 0, 0, dist ) );
        this.model.rotate_globalY( Math.random() * 360 );
        this.model.rotate_globalX( Math.random() * 40 - 20 );

        this.speed = speed;

        this.add_mesh( new CubeMesh( shader, vec3.fromValues( scale, scale, scale ) ) );
    }

    update() {

        this.model.rotate_globalY( this.speed );

        this.meshes[0].model.rotateX( this.speed * Math.random() );
    }
}