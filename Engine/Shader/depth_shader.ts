import M_Shader from "./M_shader.js";
import M_Mesh from "../Mesh/M_Mesh";
import { gl } from "../engine.js";
import CubeMesh from "../../Game/Meshes/cube.js";
import { projection_matrix, view_matrix } from "../engine.js";
import { VAOWrapper } from "../Mesh/mesh_loader.js";

/*
* Draws the objects depth values to a texture later to be used as a shadow map
* */

export default class DepthShader extends M_Shader {

    vertex_shader() : string {
        // language=GLSL
        return `#version 300 es
            precision highp float;
            
            layout( location = 0 ) in vec3 aVertexPosition;
            
            uniform mat4 uModelMatrix;
            uniform mat4 uViewMatrix;
            uniform mat4 uProjectionMatrix;
            
            void main() {
                
                gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4( aVertexPosition, 1.0 );
            }
        `;
    }

    fragment_shader() : string {
        // language=GLSL
        return `#version 300 es
            precision highp float;

            out vec4 out_colour;

            void main()
            {
                out_colour = vec4( 1.0 );
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
    }

    protected class_bindings( vao_wrapper : VAOWrapper, instances : M_Mesh[] ) {

        gl.bindVertexArray( vao_wrapper.vao );

        for( const mesh of instances ) {

            this.instance_bindings( mesh );

            //  Draw
            gl.drawElements( gl.TRIANGLES, vao_wrapper.face_size, gl.UNSIGNED_SHORT, 0 );
        }

        gl.bindVertexArray( null );
    }

    protected instance_bindings( instance : M_Mesh ) {

        //  Send Model Matrix
        gl.uniformMatrix4fv( this.bindings.model_matrix, false, new Float32Array( instance.frame_model ) );
    }
}