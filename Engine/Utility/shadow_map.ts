import { canvas, depth_shader, gl } from "../engine.js";
import M_Shader from "../Shader/M_shader.js";

export default class ShadowMap {

    static frame_buffer : WebGLBuffer;
    static texture : WebGLTexture;
    static depth : WebGLBuffer;

    static shader : M_Shader;
    static quad : any;

    static extension : WEBGL_depth_texture;

    static initialize() {

        //  Enables to attach texture to fragment as DEPTH_ATTACHMENT
        //  Enables internalType of texture to be DEPTH_COMPONENT
        ShadowMap.extension = gl.getExtension( 'WEBGL_depth_texture' );


        ShadowMap.init_buffers();
        ShadowMap.init_quad_and_shader();
    }

    static init_buffers() {

        // Create and bind the frame buffer
        ShadowMap.frame_buffer = gl.createFramebuffer();
        gl.bindFramebuffer( gl.FRAMEBUFFER, ShadowMap.frame_buffer );

        // Create a texture to render to
        ShadowMap.texture = gl.createTexture();
        gl.bindTexture( gl.TEXTURE_2D, ShadowMap.texture );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
        //  Attach it to fragment
        gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, ShadowMap.texture, 0 );


        //  Create the depth buffer
        ShadowMap.depth = gl.createTexture();
        gl.bindTexture( gl.TEXTURE_2D, ShadowMap.depth );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
        //  Attach it to fragment
        gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, ShadowMap.depth, 0 );


        //  Cut binding
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );


        //  ShadowMap.viewport will be called in the canvas.refresh which is just after this initialization
    }

    static viewport( textureWidth, textureHeight ) {

        //  Refresh Texture
        gl.bindTexture( gl.TEXTURE_2D, ShadowMap.texture );

        let internalFormat = gl.RGBA;
        let format = gl.RGBA;
        let type =  gl.UNSIGNED_BYTE;

        gl.texImage2D( gl.TEXTURE_2D, 0, internalFormat,
            textureWidth, textureHeight, 0,
            format, type, null );


        //  Refresh Buffer
        gl.bindTexture( gl.TEXTURE_2D, ShadowMap.depth );

        internalFormat = gl.DEPTH_COMPONENT;
        format = gl.DEPTH_COMPONENT;
        type = gl.UNSIGNED_SHORT;

        gl.texImage2D( gl.TEXTURE_2D, 0, internalFormat,
            textureWidth, textureHeight, 0,
            format, type, null );


        //  Check if frame buffer is successfully created
        if( gl.checkFramebufferStatus( gl.FRAMEBUFFER ) != gl.FRAMEBUFFER_COMPLETE ) {

            throw Error( "Depth Buffer error while resizing!" );
        }
    }

    static init_quad_and_shader() {

        ShadowMap.shader = depth_shader;

        const quad : any = {};


        //  Prepare Vertices
        quad.vertices = new Float32Array(
            [-1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]
        );
        quad.vertex_size = quad.vertices.length;

        quad.vertex_buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, quad.vertex_buffer );
        gl.bufferData( gl.ARRAY_BUFFER, quad.vertices, gl.STATIC_DRAW );


        //  Prepare UV Map
        quad.uvmap = new Float32Array(
            [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]
        );

        quad.uvmap_buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, quad.uvmap_buffer );
        gl.bufferData( gl.ARRAY_BUFFER, quad.uvmap, gl.STATIC_DRAW );


        //  Enable attributes
        gl.enableVertexAttribArray( <number>this.shader.bindings.position_attr );
        gl.enableVertexAttribArray( <number>this.shader.bindings.uvmap_attr );

        ShadowMap.quad = quad;
    }

    static draw() {

        gl.useProgram( ShadowMap.shader.program );

        //  Send vertices
        gl.bindBuffer( gl.ARRAY_BUFFER, ShadowMap.quad.vertex_buffer );
        gl.vertexAttribPointer( <number>ShadowMap.shader.bindings.position_attr, 2, gl.FLOAT, false, 0, 0 );

        //  Send uv map
        gl.bindBuffer( gl.ARRAY_BUFFER, ShadowMap.quad.uvmap_buffer );
        gl.vertexAttribPointer( <number>ShadowMap.shader.bindings.uvmap_attr, 2, gl.FLOAT, false, 0, 0 );


        //  Activate texture
        // gl.uniform1i( ShadowMap.shader.bindings.texture, 0 );
        // gl.activeTexture( gl.TEXTURE0 );
        // gl.bindTexture( gl.TEXTURE_2D, ShadowMap.texture );

        //  Activate depth
        gl.uniform1i( ShadowMap.shader.bindings.depth, 1 );
        gl.activeTexture( gl.TEXTURE1 );
        gl.bindTexture( gl.TEXTURE_2D, ShadowMap.depth );

        //  Draw
        gl.drawArrays( gl.TRIANGLES, 0, ShadowMap.quad.vertex_size / 2 );

    }
}