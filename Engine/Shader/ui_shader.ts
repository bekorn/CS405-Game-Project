import M_Shader from "./M_shader.js";
import M_Mesh from "../Mesh/M_Mesh";
import { gl } from "../engine.js";
import ShadowMap from "../Utility/shadow_map.js";
import { VAO } from "../Mesh/mesh_loader.js";
import UIElement from "../Essentials/ui_element.js";

/*
* Draws the given texture into the scene
* */

export default class UIShader extends M_Shader {

    vertex_shader() : string {
        return `
            precision highp float;
            
            attribute vec3 aVertexPosition;
            attribute vec2 aUVMap;
            
            uniform mat4 uModelMatrix;
            
            varying vec3 pos;
            varying vec2 uvmap;
            
            void main() {
            
                pos = aVertexPosition;
                uvmap = aUVMap;
                
                gl_Position = uModelMatrix * vec4( aVertexPosition, 1.0 );
            }
        `;
    }

    fragment_shader() : string {
        return `
            precision highp float;
            precision highp sampler2D;
            
            uniform sampler2D uTextureSampler;
            
            varying vec3 pos;
            varying vec2 uvmap;
            
            void main()
            {
                vec4 tex =  texture2D( uTextureSampler, uvmap );
                
                if( tex.a < 0.5 ) {
                    discard;
                }
                else {
                    gl_FragColor = vec4( tex.rgb, 1.0 );
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

    protected class_bindings( vao : VAO, instances : M_Mesh[]  ) {

        //  Send vertices
        gl.bindBuffer( gl.ARRAY_BUFFER, vao.vertex_buffer );
        gl.vertexAttribPointer( <number>this.bindings.position_attr, 3, gl.FLOAT, false, 0, 0 );

        //  Send uv map
        gl.bindBuffer( gl.ARRAY_BUFFER, vao.uvmap_buffer );
        gl.vertexAttribPointer( <number>this.bindings.uvmap_attr, 2, gl.FLOAT, false, 0, 0 );

        for( let mesh of instances ) {

            this.instance_bindings( mesh );

            //  Draw
            gl.drawElements( gl.TRIANGLES, vao.face_size, gl.UNSIGNED_SHORT, 0 );
        }
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