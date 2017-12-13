import M_Shape from "../Mesh/M_Mesh.js";
import {glMatrix, vec3, mat4} from "../Utility/GL/gl-matrix.js";
import M_Shader from "../Utility/Shader/M_shader.js";
import M_Mesh from "../Mesh/M_Mesh.js";
import M_Texture from "../Texture/M_Texture.js";
import M_Material from "../Material/M_Material.js";
import Model from "../Utility/model.js";
import { scene } from "../game.js";

export default abstract class M_Object {

    static id : number = 0;
    id : number = M_Object.id++;

    parent : M_Object = null;
    children: M_Object[] = [];

    shader : M_Shader;
    model : Model = new Model( this );

    meshes : M_Mesh[] = [];
    textrures : M_Texture[] = [];
    materials : M_Material[] = [];

    constructor( shader: M_Shader, parent : M_Object = scene ) {
        this.shader = shader;
    }

    add_child( obj: M_Object, relative_dist: vec3 = vec3.create() ) : void {

        obj.parent = this;

        obj.model.parent_model = this.model;

        // vec3.multiply( obj.model.parent_scale, this.model.scale, this.model.parent_scale );

        obj.model.translate_global( relative_dist );

        this.children.push( obj );
    }

    add_mesh( mesh : M_Mesh, relative_dist: vec3 = vec3.create() ) : void {

        mesh.parent = this;

        mesh.model.parent_model = this.model;

        // vec3.multiply( mesh.model.parent_scale, this.model.scale, this.model.parent_scale );

        mesh.model.translate_global( relative_dist );

        this.meshes.push( mesh );
    }

    move() : void {

    }

    collide() : void {

    }

    update() : void {

    }

    async draw( parent_model: mat4 ) : Promise<any> {

        // console.log( "Drawing OBJECT:"+ this.id );

        let model = mat4.create();
        mat4.multiply( model, parent_model, this.model.get_model() );

        //  Wait for all children to draw their meshes
        await Promise.all( this.children.map( (child) => child.draw( model ) ) );

        //  Draw your meshes asynchronously
        return Promise.all( this.meshes.map( (mesh) => mesh.draw( model ) ) );
    }

}