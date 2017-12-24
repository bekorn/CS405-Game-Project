import {vec3, mat4} from "../Utility/GL/gl-matrix.js";
import M_Shader from "../Shader/M_shader.js";
import M_Mesh from "../Mesh/M_Mesh.js";
import M_Texture from "../Texture/M_Texture.js";
import M_Material from "../Material/M_Material.js";
import Model from "../Utility/model.js";
import { scene } from "../engine.js";

export default abstract class M_Object {

    static id : number = 0;
    id : number = M_Object.id++;

    parent : M_Object = null;
    children: M_Object[] = [];

    model : Model = new Model( this );

    meshes : M_Mesh[] = [];
    textures : M_Texture[] = [];
    materials : M_Material[] = [];

    constructor( parent : M_Object = scene ) {

        if( parent != null ) {

            parent.add_child( this );
        }
    }

    add_child( obj: M_Object, relative_dist: vec3 = vec3.create() ) : M_Object {

        obj.parent = this;

        obj.model.parent_model = this.model;

        // vec3.multiply( obj.model.parent_scale, this.model.scale, this.model.parent_scale );

        obj.model.translate_global( relative_dist );

        this.children.push( obj );

        return obj;
    }

    add_mesh( mesh : M_Mesh, relative_dist: vec3 = vec3.create() ) : M_Mesh {

        mesh.parent = this;

        mesh.model.parent_model = this.model;

        // vec3.multiply( mesh.model.parent_scale, this.model.scale, this.model.parent_scale );

        mesh.model.translate_global( relative_dist );

        this.meshes.push( mesh );

        return mesh;
    }

    move() : void {

    }

    collide() : void {

    }

    update( delta_time : number ) : void {

    }

    async refresh_model( parent_model: mat4 ) : Promise<any> {

        // console.log( "Drawing OBJECT:"+ this.id );

        let model = mat4.create();
        mat4.multiply( model, parent_model, this.model.get_model() );

        //  Wait for all children to refresh_model their meshes
        await Promise.all( this.children.map( (child) => child.refresh_model( model ) ) );

        //  Draw your meshes asynchronously
        return Promise.all( this.meshes.map( (mesh) => mesh.refresh_model( model ) ) );
    }

}