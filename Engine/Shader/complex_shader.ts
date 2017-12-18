import M_Shader from "./M_shader.js";

export default class ComplexShader extends M_Shader {

    vertex_shader() {
        return `
            precision highp float;
            
            attribute vec3 aVertexPosition;
            attribute vec3 aNormal;
            attribute vec2 aUVMap;
        
            uniform mat4 uModelMatrix;
            uniform mat4 uViewMatrix;
            uniform mat4 uProjectionMatrix;
            
            uniform mat4 uLightViewProjection;
            
            varying vec3 originalPos;
            varying vec4 worldPos;
            varying vec3 normal;
            varying vec2 uvmap;
            
            varying vec4 shadowPos;
            
            
            void main() {
            
                uvmap = aUVMap;
                
                mat4 depthScaleMatrix = mat4(0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);
                
                shadowPos = depthScaleMatrix * uLightViewProjection * uModelMatrix * vec4( aVertexPosition, 1.0 );
                shadowPos /= shadowPos.w;
                
                originalPos = aVertexPosition;
                
                gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4( aVertexPosition, 1.0 );
                
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
            precision highp float;
            precision highp sampler2D;
            
            uniform vec3 uLightPos;
            uniform vec3 uCameraPos;
            
            uniform vec3 uMaterialColour;
            uniform float uSpecularFactor;
            
            uniform sampler2D uTexture;
            uniform sampler2D uShadowMap;
            
            varying vec3 originalPos;
            varying vec4 worldPos;
            varying vec3 normal;
            varying vec2 uvmap;
            
            varying vec4 shadowPos;
            
            float shadow_value( in sampler2D shadow_map, in vec4 pos, in float bias ) {
            
                if( abs( shadowPos.x ) > 1.0  ||  abs( shadowPos.y ) > 1.0 ) {
                
                    return 1.0;
                }
                
                float shadow_diff = pos.z - texture2D( shadow_map, pos.xy ).r;
                
                if( shadow_diff > bias ) {
                
                    return 0.0;
                }
                else {
                
                    return 1.0;
                }
            }
            
            void main() {
            
                vec3 light_colour = vec3( 1.0 );
                vec3 texture = texture2D( uTexture, uvmap ).rgb;
                float visibility = 0.0;
                vec3 colour = vec3( 0.0 );
                
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
                    specular = pow( specular, uSpecularFactor );
                }
                
                
                //  Shadow Mapping
                float shadow_bias = 0.0008;
                
                visibility = shadow_value( uShadowMap, shadowPos, shadow_bias );
                
                
                colour = (texture * (ambient + diffuse * visibility)) + (specular * visibility);
                
                gl_FragColor = vec4( colour, 1.0 );
            }
        `;
    }

    fragment_shader_with_gradient_shadows() {
        return `
            precision highp float;
            precision highp sampler2D;
            
            uniform vec3 uLightPos;
            uniform vec3 uCameraPos;
            
            uniform vec3 uMaterialColour;
            uniform float uSpecularFactor;
            
            uniform sampler2D uTexture;
            uniform sampler2D uShadowMap;
            
            varying vec3 originalPos;
            varying vec4 worldPos;
            varying vec3 normal;
            varying vec2 uvmap;
            
            varying vec4 shadowPos;
            
            float shadow_value( in sampler2D shadow_map, in vec4 pos, in float bias ) {
            
                float shadow_diff = pos.z - texture2D( shadow_map, pos.xy ).r;
                
                // if( shadow_diff > bias )
                    return shadow_diff;
                // else
                //     return 1.0;
            }
            
            void main() {
            
                vec3 light_colour = vec3( 1.0 );
                vec3 texture = texture2D( uTexture, uvmap ).rgb;
                float visibility = 0.0;
                vec3 colour = vec3( 0.0 );
                
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
                    specular = pow( specular, uSpecularFactor );
                }
                
                
                //  Shadow Mapping
                float shadow_bias = 0.0008;
                float shadow_diff = shadowPos.z - texture2D( uShadowMap, shadowPos.xy ).r;
                
                if( shadow_diff > shadow_bias ) {
                
                    float margin = (shadow_diff) * 3.0;
                    
                    const int sample = 2;
                    
                    for( int x = -sample ; x <= sample ; x++ ) {
                        for( int y = -sample ; y <= sample ; y++ ) {
                        
                            vec4 offset = vec4( x*2, y, x*y, 0.0 ) * margin;
                            
                            visibility += pow( max(0.0, shadow_value( uShadowMap, shadowPos + offset, shadow_bias ) - 0.2), 2.0 );
                        }
                    }
                    
                    visibility /= pow( float( sample * 2 + 1 ), 2.0 );
                    // visibility /= 9.0;
                    visibility = clamp( visibility, 0.0, 1.0 );
                }
                else {

                    visibility = 1.0;
                }
                
                
                colour = (texture * (ambient + diffuse * visibility)) + (specular * visibility);
                
                gl_FragColor = vec4( colour, 1.0 );
            }
        `;
    }

    binding_map : { [key: string]: any } = {
        position_attr : 'aVertexPosition',
        normal_attr : 'aNormal',
        uvmap_attr: 'aUVMap',

        model_matrix : 'uModelMatrix',
        view_matrix : 'uViewMatrix',
        projection_matrix : 'uProjectionMatrix',

        light_view_projection : 'uLightViewProjection',

        light_position : 'uLightPos',
        camera_position : 'uCameraPos',

        colour : 'uMaterialColour',
        specular : 'uSpecularFactor',

        texture : 'uTexture',
        shadow_map : 'uShadowMap',
    };

    constructor() {
        super();

        this.bind_program();

        console.log( "ComplexShader created" );
    }
}