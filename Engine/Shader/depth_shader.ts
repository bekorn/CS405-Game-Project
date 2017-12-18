import M_Shader from "./M_shader.js";

export default class DepthShader extends M_Shader {

    vertex_shader() : string {
        return `
            precision highp float;
            
            attribute vec2 aVertexPosition;
            attribute vec2 aUVMap;
            
            varying vec2 uvmap;
            
            void main() {
            
                uvmap = aUVMap;
                
                gl_Position = vec4( aVertexPosition, 0.0, 1.0 );
            }
        `;
    }

    fragment_shader() : string {
        return `
            precision highp float;
            precision highp sampler2D;
            
            // uniform sampler2D uTextureSampler;
            uniform sampler2D uDepthSampler;
            
            varying vec2 uvmap;
            
            void main()
            {
                // vec3 tex_colour = texture2D( uTextureSampler, uvmap ).rgb;
                float depth = texture2D( uDepthSampler, uvmap ).r;
                gl_FragColor = vec4( depth, 0,0, 1.0 );
            }
        `;
    }

    binding_map : { [p : string] : string } = {
        position_attr : 'aVertexPosition',
        uvmap_attr: 'aUVMap',

        // texture : 'uTextureSampler',
        depth : 'uDepthSampler',
    };

    constructor() {
        super();

        this.bind_program();

        console.log( "DepthShader created" );
    }
}