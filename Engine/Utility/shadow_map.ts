import { canvas, depth_shader, gl } from "../engine.js";
import M_Shader from "../Shader/M_shader.js";

export default class ShadowMap {

    static frame_buffer : WebGLBuffer;
    static texture : WebGLTexture;
    static depth : WebGLBuffer;

    static width : number;
    static height : number;

    static shader : M_Shader;
    static quad : any;

    static initialize( texture_width : number, texture_height : number ) {

        ShadowMap.width = texture_width;
        ShadowMap.height = texture_height;

        ShadowMap.init_buffers();

        //  Resize textures
        ShadowMap.viewport( texture_width, texture_height );
    }

    static init_buffers() {

        // Create and bind the frame buffer
        ShadowMap.frame_buffer = gl.createFramebuffer();
        gl.bindFramebuffer( gl.FRAMEBUFFER, ShadowMap.frame_buffer );

        // Create a texture to render to
        ShadowMap.texture = gl.createTexture();
        gl.bindTexture( gl.TEXTURE_2D, ShadowMap.texture );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
        //  Attach it to fragment
        gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, ShadowMap.texture, 0 );


        //  Create the depth buffer
        ShadowMap.depth = gl.createTexture();
        gl.bindTexture( gl.TEXTURE_2D, ShadowMap.depth );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );


        //  Attach it to fragment
        gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, ShadowMap.depth, 0 );


        //  Nullify bindings
        gl.bindTexture( gl.TEXTURE_2D, null );
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
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

        //  HIGH Precision
        // internalFormat = gl.DEPTH_COMPONENT32F;
        // format = gl.DEPTH_COMPONENT;
        // type = gl.FLOAT;


        internalFormat = gl.DEPTH_COMPONENT16;
        format = gl.DEPTH_COMPONENT;
        type = gl.UNSIGNED_INT;

        gl.texImage2D( gl.TEXTURE_2D, 0, internalFormat,
            textureWidth, textureHeight, 0,
            format, type, null );


        //  Nullify binding
        gl.bindTexture( gl.TEXTURE_2D, null );

        //  Check if frame buffer is successfully created
        gl.bindFramebuffer( gl.FRAMEBUFFER, ShadowMap.frame_buffer );
        if( gl.checkFramebufferStatus( gl.FRAMEBUFFER ) != gl.FRAMEBUFFER_COMPLETE ) {

            throw Error( "Shadow Map error while resizing!" );
        }
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
    }
}