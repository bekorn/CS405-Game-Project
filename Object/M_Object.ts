import M_Shape from "../Mesh/M_Mesh.js";
import {glMatrix, vec3, mat4} from "../Utility/GL/gl-matrix.js";
import M_Shader from "../Utility/Shader/M_shader.js";
import M_Mesh from "../Mesh/M_Mesh.js";
import M_Texture from "../Texture/M_Texture.js";
import M_Material from "../Material/M_Material.js";
import Model from "../Utility/model.js";

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

    constructor( shader: M_Shader, origin: vec3 ) {
        this.shader = shader;
        this.model.origin = origin;
    }

    add_child( obj: M_Object, relative_dist: vec3 = vec3.create() ) : void {

        vec3.add( obj.model.origin_p, this.model.origin, this.model.translation_g );

        let dist : vec3 = vec3.create();
        vec3.add( dist, this.model.origin, relative_dist );
        obj.model.translate( dist );

        vec3.multiply( obj.model.scale_p, this.model.scale, this.model.scale_p );

        obj.parent = this;

        this.children.push( obj );
    }

    add_mesh( mesh : M_Mesh, relative_dist: vec3 = vec3.create() ) : void {

        vec3.add( mesh.model.origin_p, this.model.origin, this.model.translation_g );

        let dist : vec3 = vec3.create();
        vec3.add( dist, this.model.origin, relative_dist );
        mesh.model.translate( dist );

        vec3.multiply( mesh.model.scale_p, this.model.scale, this.model.scale_p );

        mesh.parent = this;

        this.meshes.push( mesh );
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
        mat4.multiply( model, parent_model, this.model.get_model() );

        for( let child of this.children ) {
            child.draw( model );
        }

        for( let mesh of this.meshes ) {
            mesh.draw( model );
        }
    }

}