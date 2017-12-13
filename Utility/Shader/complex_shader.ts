import M_Shader from "./M_shader.js";

export default class ComplexShader extends M_Shader {

    vertex_shader() {
        return `
            precision mediump float;
            
            attribute vec3 aVertexPosition;
            attribute vec3 aNormal;
        
            uniform mat4 uModelMatrix;
            uniform mat4 uViewMatrix;
            uniform mat4 uProjectionMatrix;
            
            varying vec3 originalPos;
            varying vec4 worldPos;
            varying vec3 normal;
            
            
            void main() {
            
                originalPos = aVertexPosition;
                
                gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix  * vec4( aVertexPosition, 1.0 );
                
                
                worldPos = uModelMatrix * vec4( aVertexPosition, 1.0 );
                worldPos /= worldPos.w;
                
                vec4 normalPos = uModelMatrix * vec4( aVertexPosition + aNormal, 1.0 );
                normalPos /= normalPos.w;
                
                normal = normalize( normalPos - worldPos ).xyz;
            }
        `;
    }

    fragment_shader() {
        return `
            precision mediump float;
            
            uniform vec3 uLightPos;
            uniform vec3 uCameraPos;
            
            varying vec3 originalPos;
            varying vec4 worldPos;
            varying vec3 normal;
            
            void main() {
                
                vec3 material_colour = vec3( 0.423529412, 0.956862745, 0.274509804 );
                vec3 light_colour = vec3( 1.0 );
                vec3 result = vec3( 0.0 );
                
                float ambient = 0.0;
                float diffuse = 0.0;
                float specular = 0.0;
                
                vec3 lightDir = normalize( uLightPos - worldPos.xyz );
                float dotNL = dot( lightDir, normal );
                
                //  Ambient Lighting
                ambient = 0.1;
                
                if( dotNL > 0.0 )
                {
                    //  Diffuse Lighting
                    diffuse = dotNL;
                    
                    
                    //  Specular Lighting
                    vec3 toEye = normalize( worldPos.xyz - uCameraPos );
                    vec3 reflect = reflect( lightDir, normal );
                    
                    specular = clamp( dot( toEye, reflect ), 0.0, 1.0 );
                    specular = pow( specular, 512.0 );
                }
                
                result = (material_colour * (ambient + diffuse)) + (specular);
                
                gl_FragColor = vec4( result, 1.0 );
            }
        `;
    }

    binding_map : { [key: string]: any } = {
        position_attr : 'aVertexPosition',
        normal_attr : 'aNormal',

        model_matrix : 'uModelMatrix',
        view_matrix : 'uViewMatrix',
        projection_matrix : 'uProjectionMatrix',

        light_position : 'uLightPos',
        camera_position : 'uCameraPos'
    };

    constructor() {
        super();

        this.bind_program();

        console.log( "SimpleShader created" );
    }
}