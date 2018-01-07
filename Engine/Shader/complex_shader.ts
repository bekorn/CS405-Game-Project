import M_Shader from "./M_shader.js";
import { camera, gl, light, projection_matrix, view_matrix } from "../engine.js";
import M_Mesh from "../Mesh/M_Mesh.js";
import CubeMesh from "../../Game/Meshes/cube.js";
import ShadowMap from "../Utility/shadow_map.js";
import { VAOWrapper } from "../Mesh/mesh_loader.js";


export default class ComplexShader extends M_Shader {

    vertex_shader() {
        // language=GLSL
        return `#version 300 es
            precision highp float;
            
            layout( location = 0 ) in vec3 aVertexPosition;
            layout( location = 1 ) in vec3 aNormal;
            layout( location = 2 ) in vec2 aUVMap;
        
            uniform mat4 uModelMatrix;
            uniform mat4 uViewMatrix;
            uniform mat4 uProjectionMatrix;
            
            uniform mat4 uLightViewProjection;
            
            out vec3 originalPos;
            out vec4 worldPos;
            out vec4 modelViewPos;
            out vec3 normal;
            out vec2 uvmap;
            
            out vec4 shadowPos;
            
            
            void main() {
            
                vec4 tranlatedUV = uModelMatrix * vec4( aUVMap * 2.0 - 1.0, 0.0, 0.0 );
//                tranlatedUV /= tranlatedUV.w;
                uvmap = ( tranlatedUV.xy + 1.0) / 2.0;
//                uvmap = aUVMap;
                
                mat4 depthScaleMatrix = mat4(0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);
                
                shadowPos = depthScaleMatrix * uLightViewProjection * uModelMatrix * vec4( aVertexPosition, 1.0 );
                shadowPos /= shadowPos.w;
                
                originalPos = aVertexPosition;
                
                gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4( aVertexPosition, 1.0 );
                
                worldPos = uModelMatrix * vec4( aVertexPosition, 1.0 );
                worldPos /= worldPos.w;
                
                modelViewPos = uViewMatrix * worldPos;
                modelViewPos /= modelViewPos.w;
                
                vec4 normalPos = uModelMatrix * vec4( aVertexPosition + aNormal, 1.0 );
                normalPos /= normalPos.w;
                
                normal = normalize( normalPos - worldPos ).xyz;
            }
        `;
    }

    fragment_shader() {
        // language=GLSL
        return `#version 300 es
            precision highp float;
            precision highp sampler2D;
            
            uniform vec3 uLightPos;
            uniform vec3 uCameraPos;
            uniform float uCameraFar;
            
            uniform vec3 uMaterialColour;
            uniform float uSpecularFactor;
            
            uniform sampler2D uTexture;
            uniform sampler2D uShadowMap;
            uniform float uShadowMapTexelSize;
            
            in vec3 originalPos;
            in vec4 worldPos;
            in vec4 modelViewPos;
            in vec3 normal;
            in vec2 uvmap;
            
            in vec4 shadowPos;
            
            out vec4 out_colour;
            
            float SampleShadowMap( vec2 pos, float compare ) {
                return step( compare, texture( uShadowMap, pos ).r );
            }
            
            float SampleShadowMapLinear( vec2 pos, float compare, vec2 texel_size ) {
            
                vec2 pixelPos = (pos / texel_size);
                vec2 fraction = fract( pixelPos );
                vec2 bottom_left = (pixelPos - fraction) * texel_size;
                
                float bl = SampleShadowMap( bottom_left, compare );
                float tl = SampleShadowMap( bottom_left + vec2( 0.0, texel_size.y ), compare );
                float br = SampleShadowMap( bottom_left + vec2( texel_size.x, 0.0 ), compare );
                float tr = SampleShadowMap( bottom_left + texel_size, compare );
                
                float l_mix = mix( bl, tl, fraction.y );
                float r_mix = mix( br, tr, fraction.y );
                
                return mix( l_mix, r_mix, fraction.x );
            }
            
            float SampleShadowMapArea( vec2 pos, float compare, vec2 texel_size, float sample_size ) {
            
                float shadow = 0.0;
                
                float total_samples = sample_size * sample_size;
                
                float range = (sample_size - 1.0) / 2.0;
            
                for( float x = -range ; x <= range; x++ )
                {
                    for( float y = -range ; y <= range ; y++ )
                    {
                        shadow += SampleShadowMap( pos + vec2(x, y) * texel_size, compare );
                    }
                }
                
                return shadow / total_samples;
            }
            
            float AverageBlockerDistance( vec2 pos, float compare, float sample_size, vec2 texel_size ) {
            
                float blockers = 0.0;
                float distance = 0.0;
                float range = ( sample_size - 1.0 ) / 2.0;
                
                for( float x = -range; x <= range; x++ ) {
                    for( float y = -range; y <= range; y++ ) {
                    
                        float depth = texture( uShadowMap, pos + vec2(x, y) * texel_size ).r;
                        if( depth < compare ) {
                            blockers++;
                            distance += depth;
                        }
                    }
                }
                
                if( blockers > 0.0 ) {
                
                    return distance / blockers;
                }
                else {
                
                    return -1.0;
                }
            }
            
            float SmoothShadow() {
            
                vec2 texel_size = vec2(1.0) / vec2( textureSize( uShadowMap, 0 ) );
                float avg_dist = AverageBlockerDistance( shadowPos.xy, shadowPos.z, 5.0, texel_size );
                
                if( avg_dist == -1.0 ) {
                    return 1.0;
                }
                else {
                    const float light_width = 20.0;
                    float blocker = avg_dist;
                    float receiver = shadowPos.z - blocker;
                    float sample_size = light_width * receiver / blocker;
                    return SampleShadowMapArea( shadowPos.xy, shadowPos.z, texel_size, min( ceil( sample_size ), 40.0 ) );
                }
            }

            void main() {

                float fog_start = uCameraFar / 4.0;
                float fog_end = uCameraFar;
                float frag_coord = length( modelViewPos );
                
                float fog_factor = 1.0 - clamp( (fog_end - frag_coord) / (fog_end - fog_start), 0.0, 1.0 );
            
            
                vec3 light_colour = vec3( 1.0 );
                vec3 texture_colour = texture( uTexture, uvmap ).rgb;
                float visibility = 0.0;
                vec3 colour = vec3( 0.0 );
                
                float ambient = 0.0;
                float diffuse = 0.0;
                float specular = 0.0;
                
                vec3 lightDir = normalize( uLightPos - worldPos.xyz );
                float dotNL = dot( lightDir, normal );
                
                //  Ambient Lighting
                ambient = 0.3;
                
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
                if( abs( shadowPos.x ) > 1.0  ||  abs( shadowPos.y ) > 1.0  ||  abs( shadowPos.z ) > 1.0 ) {
                
                    visibility = 1.0;
                }
                else {
                
                    visibility = SmoothShadow();
                }
                
                //  Blend light values
                colour = (texture_colour * (ambient + (diffuse * visibility))) + (specular * visibility);
                
                //  Fog effect
                colour = mix( colour, vec3(0.0), fog_factor );
                
                out_colour = vec4( colour, 1.0 );
            }
        `;
    }

    binding_map : { [key: string]: string } = {
        position_attr : 'aVertexPosition',
        normal_attr : 'aNormal',
        uvmap_attr: 'aUVMap',

        model_matrix : 'uModelMatrix',
        view_matrix : 'uViewMatrix',
        projection_matrix : 'uProjectionMatrix',

        light_view_projection : 'uLightViewProjection',

        light_position : 'uLightPos',
        camera_position : 'uCameraPos',
        camera_far : 'uCameraFar',

        colour : 'uMaterialColour',
        specular : 'uSpecularFactor',

        texture : 'uTexture',
        shadow_map : 'uShadowMap',
    };

    static singleton : ComplexShader;

    static initialize() {

        if( ComplexShader.singleton == null ) {

            ComplexShader.singleton = new ComplexShader();
        }

        return ComplexShader.singleton;
    }

    private constructor() {
        super();

        this.bind_program();

        console.log( "ComplexShader created" );
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

        gl.uniformMatrix4fv( this.bindings.light_view_projection, false, new Float32Array( light.view_projection_matrix ) );

        gl.uniform3fv( this.bindings.light_position, new Float32Array( light.model.global_position() ) );
        gl.uniform3fv( this.bindings.camera_position, new Float32Array( camera.model.global_position() ) );
        gl.uniform1f( this.bindings.camera_far, camera.far );


        //  Activate and Bind Shadow Map
        gl.uniform1i( this.bindings.shadow_map, 1 );        //  Set texture1 shadow map
        gl.activeTexture( gl.TEXTURE1 );                       //  Use shadow map
        gl.bindTexture( gl.TEXTURE_2D, ShadowMap.depth );
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

        //  Send Uniforms
        gl.uniformMatrix4fv( this.bindings.model_matrix, false, new Float32Array( instance.frame_model ) );

        gl.uniform3fv( this.bindings.colour, instance.colour );
        gl.uniform1f( this.bindings.specular, instance.specular );

        //  Activate and Bind Texture
        gl.uniform1i( this.bindings.texture, 0 );    //  Set texture0 your texture
        gl.activeTexture( gl.TEXTURE0 );                //  Use texture
        gl.bindTexture( gl.TEXTURE_2D, instance.texture );
    }
}