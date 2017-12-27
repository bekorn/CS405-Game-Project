import M_Mesh from "./M_Mesh.js";
import MeshLoader from "./mesh_loader.js";
import { vec3 } from "../Utility/GL/gl-matrix.js";

export default class Plane extends M_Mesh {

    static instance_list : Plane[] = [];

    static vao() {

        return MeshLoader.loaded_meshes[ 'plane' ];
    }


    constructor( dimensions : vec3 ) {

        super();

        this.model.scale_v3_up( dimensions );

        Plane.instance_list.push( this );
    }

    remove_self() {

        super.remove_self();

        let index = Plane.instance_list.indexOf( this );
        Plane.instance_list.splice( index, 1 );
    }
}