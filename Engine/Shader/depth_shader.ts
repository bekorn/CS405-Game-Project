import M_Shader from "./M_shader.js";
import M_Mesh from "../Mesh/M_Mesh";
import { gl } from "../engine.js";
import { VAO } from "../Mesh/mesh_loader.js";
import CubeMesh from "../../Game/Meshes/cube.js";
import { projection_matrix, view_matrix } from "../engine.js";

/*
* Draws the objects depth values to a texture later to be used as a shadow map
* */

export default class DepthShader extends M_Shader {

    vertex_shader() : string {
        return `
            precision highp float;
            
            attribute vec3 aVertexPosition;
            
            uniform mat4 uModelMatrix;
            uniform mat4 uViewMatrix;
            uniform mat4 uProjectionMatrix;
            
            void main() {
                
                gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4( aVertexPosition, 1.0 );
            }
        `;
    }

    fragment_shader() : string {
        return `
            void main()
            {
                gl_FragColor = vec4( 1.0 );
            }
        `;
    }

    binding_map : { [p : string] : string } = {
        position_attr : 'aVertexPosition',

        model_matrix : 'uModelMatrix',
        view_matrix : 'uViewMatrix',
        projection_matrix : 'uProjectionMatrix',
    };

    static singleton : DepthShader;
    static extension : WEBGL_depth_texture;

    static initialize() {

        if( DepthShader.singleton == null ) {

            DepthShader.singleton = new DepthShader();
        }

        return DepthShader.singleton;
    }
    
    private constructor() {
        super();

        this.bind_program();

        console.log( "DepthShader created" );
    }


    public render() {

        this.frame_bindings();

        this.class_bindings( CubeMesh.vao(), CubeMesh.instance_list );
    }

    protected frame_bindings() {

        //  Select Program
        gl.useProgram( this.program );


        //  Send Uniforms
        gl.uniformMatrix4fv( this.bindings.view_matrix, false, new Float32Array( view_matrix ) );
        gl.uniformMatrix4fv( this.bindings.projection_matrix, false, new Float32Array( projection_matrix ) );


        //  Enable attributes
        gl.enableVertexAttribArray( <number>this.bindings.position_attr );
    }

    protected class_bindings( vao : VAO, instances : M_Mesh[] ) {

        //  Bind Vertices
        gl.bindBuffer( gl.ARRAY_BUFFER, vao.vertex_buffer );
        gl.vertexAttribPointer( <number>this.bindings.position_attr, 3, gl.FLOAT, false, 0, 0);
        //  TODO: Can these vertexAttribPointer's be in frame bindings?

        //  Bind Faces (and Draw)
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, vao.faces_buffer );


        for( let mesh of instances ) {

            this.instance_bindings( mesh );

            //  Draw
            gl.drawElements( gl.TRIANGLES, vao.face_size, gl.UNSIGNED_SHORT, 0 );
        }

    }

    protected instance_bindings( instance : M_Mesh ) {

        //  Send Model Matrix
        gl.uniformMatrix4fv( this.bindings.model_matrix, false, new Float32Array( instance.frame_model ) );
    }
}