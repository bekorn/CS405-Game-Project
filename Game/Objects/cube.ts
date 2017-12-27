import M_Object from "../../Engine/Object/M_Object.js";
import CubeMesh from "../Meshes/cube.js";
import { vec3 } from '../../Engine/Utility/GL/gl-matrix.js';
import { scene } from "../../Engine/engine.js";
import AABB from "../../Engine/Physics/AABB.js";

export default class Cube extends M_Object {

    constructor( dimension : vec3, parent : M_Object = scene ) {

        super( parent );

        this.add_mesh( new CubeMesh( dimension ) );
    }
}