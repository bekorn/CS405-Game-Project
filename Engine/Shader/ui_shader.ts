import M_Shader from "./M_shader.js";
import M_Mesh from "../Mesh/M_Mesh";
import { gl } from "../engine.js";
import UIElement from "../Essentials/ui_element.js";
import { VAOWrapper } from "../Mesh/mesh_loader.js";

/*
* Draws the given texture into the scene
* */

export default class UIShader extends M_Shader {

    vertex_shader() : string {
        // language=GLSL
        return `#version 300 es
            precision highp float;
            
            layout( location = 0 ) in vec3 aVertexPosition;
            layout( location = 2 ) in vec2 aUVMap;
            
            uniform mat4 uModelMatrix;
            
            out vec3 pos;
            out vec2 uvmap;
            
            void main() {
            
                pos = aVertexPosition;
                uvmap = aUVMap;
                
                gl_Position = uModelMatrix * vec4( aVertexPosition, 1.0 );
            }
        `;
    }

    fragment_shader() : string {
        // language=GLSL
        return `#version 300 es
            precision highp float;
            precision highp sampler2D;
            
            uniform sampler2D uTextureSampler;
            
            in vec3 pos;
            in vec2 uvmap;
            
            out vec4 out_colour;
            
            void main()
            {
                vec4 tex =  texture( uTextureSampler, uvmap );
                
                if( tex.a < 0.5 ) {
                    discard;
                }
                else {
                    out_colour = vec4( tex.rgb, 1.0 );
                }
                
                // gl_FragColor = vec4( pos, 1.0 );
            }
        `;
    }

    binding_map : { [p : string] : string } = {
        position_attr : 'aVertexPosition',
        uvmap_attr: 'aUVMap',

        model_matrix : 'uModelMatrix',

        texture : 'uTextureSampler',
    };

    static singleton : UIShader;

    static initialize() {

        if( UIShader.singleton == null ) {

            UIShader.singleton = new UIShader();
        }

        return UIShader.singleton;
    }
    
    private constructor() {
        super();

        this.bind_program();

        console.log( "UIShader created" );
    }



    public render() {

        this.frame_bindings();

        this.class_bindings( UIElement.vao(), UIElement.instance_list );
    }

    protected frame_bindings() {

        //  Use Program
        gl.useProgram( this.program );
    }

    protected class_bindings( vao_wrapper : VAOWrapper, instances : M_Mesh[]  ) {

        gl.bindVertexArray( vao_wrapper.vao );

        for( const mesh of instances ) {

            this.instance_bindings( mesh );

            //  Draw
            gl.drawElements( gl.TRIANGLES, vao_wrapper.face_size, gl.UNSIGNED_SHORT, 0 );
        }

        gl.bindVertexArray( null );
    }

    protected instance_bindings( instance : M_Mesh ) {

        //  Send model
        gl.uniformMatrix4fv( this.bindings.model_matrix, false, new Float32Array( instance.frame_model ) );

        //  Activate depth
        gl.uniform1i( this.bindings.depth, 0 );
        gl.activeTexture( gl.TEXTURE0 );
        gl.bindTexture( gl.TEXTURE_2D, instance.texture );
    }
}