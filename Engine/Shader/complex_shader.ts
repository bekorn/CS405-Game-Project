import M_Shader from "./M_shader.js";
import { mat4 } from "../Utility/GL/gl-matrix.js";
import { camera, gl, light, projection_matrix, view_matrix } from "../engine.js";
import M_Mesh from "../Mesh/M_Mesh.js";
import { VAO } from "../Mesh/mesh_loader.js";
import CubeMesh from "../../Game/Meshes/cube.js";
import ShadowMap from "../Utility/shadow_map.js";


export default class ComplexShader extends M_Shader {

    vertex_shader() {
        // language=GLSL
        return `#version 300 es
            precision highp float;
            
            in vec3 aVertexPosition;
            in vec3 aNormal;
            in vec2 aUVMap;
        
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
            
            float SampleShadowMap( sampler2D shadow_map, vec2 pos, float compare ) {
                return step( compare, texture( shadow_map, pos ).r );
            }
            
            float SampleShadowMapLinear( sampler2D shadow_map, vec2 pos, float compare, vec2 texel_size ) {
            
                vec2 pixelPos = (pos / texel_size);
                vec2 fraction = fract( pixelPos );
                vec2 bottom_left = (pixelPos - fraction) * texel_size;
                
                float bl = SampleShadowMap( shadow_map, bottom_left, compare );
                float tl = SampleShadowMap( shadow_map, bottom_left + vec2( 0.0, texel_size.y ), compare );
                float br = SampleShadowMap( shadow_map, bottom_left + vec2( texel_size.x, 0.0 ), compare );
                float tr = SampleShadowMap( shadow_map, bottom_left + texel_size, compare );
                
                float l_mix = mix( bl, tl, fraction.y );
                float r_mix = mix( br, tr, fraction.y );
                
                return mix( l_mix, r_mix, fraction.x );
            }
            
            float SampleShadowMapArea( sampler2D shadow_map, vec2 pos, float compare, vec2 texel_size, float sample_size ) {
            
                float shadow = 0.0;
                
                float total_samples = sample_size * sample_size;
                
                float sample_start = (sample_size - 1.0) / 2.0;
                
                float sample_step = ( sample_size - 1.0 ) * 2.0;
            
                for( float x = -sample_start ; x <= sample_start; x++ )
                {
                    for( float y = -sample_start ; y <= sample_start ; y++ )
                    {
                        shadow += SampleShadowMap( shadow_map, pos + vec2(x, y) * texel_size * sample_step, compare );
                    }
                }
            
                shadow /= total_samples;
                
                return shadow;
            }
            
            float AverageBlockerDistance( sampler2D shadow_map, vec3 pos, float compare, float radius, vec2 texel_size ) {
            
                float blockers = 0.0;
                float distance = 0.0;
                
                for( float x = -radius; x < radius; x++ ) {
                    for( float y = -radius; y < radius; y++ ) {
                    
                        float depth = texture( shadow_map, pos.xy + vec2(x, y) * texel_size ).r;
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
            
            float SmoothShadow( sampler2D shadow_map, vec3 pos, float bias, vec2 texel_size ) {
            
                const float light_radius = 1.0;
                
                float closestDepth = texture( shadow_map, pos.xy ).r;
                float currentDepth = pos.z - (bias * texel_size.x);
                float diff = currentDepth - closestDepth;

//                float sample_size = clamp( floor( sqrt( diff ) / 0.05 ), 1.0, 9.0 );

//                float radius = 0.1 * (currentDepth - 0.1) / pos.z;
                float radius = clamp( floor( sqrt( diff ) / 0.03 ), 1.0, 10.0 );
                
//                float distance = AverageBlockerDistance( shadow_map, pos, currentDepth, radius, texel_size );
//                
//                if( distance == -1.0 ) {
//                    
//                    return 1.0;
//                }
                
//                float sample_radius = (pos.z - distance) / distance;
                
                return SampleShadowMapArea( shadow_map, pos.xy, currentDepth, texel_size, radius );
            }
            
/*
            float SampleShadowMap( in sampler2D shadow_map, in vec4 pos ) {
            
                float closestDepth = texture( shadow_map, pos.xy ).r;
            
                float currentDepth = pos.z;
            
                float diff = currentDepth - closestDepth;
                
//                float sample_size = min( floor( sqrt( diff ) / 0.001 ), 6.0 );
                float sample_size;

                if( diff < 0.01 ) {
                    sample_size = 0.0;
                }
                else if( diff < 0.03 ){
                    sample_size = 2.0;
                }
                else {
                    sample_size = 4.0;
                }
                
                //  If it is not shadow
//                if( diff < 0.0 ) {
//                    sample_size = 1.0;
//                }
                
                float shadow = 0.0;
                
                
                float total_samples = ( sample_size * 2.0 + 1.0 ) * ( sample_size * 2.0 + 1.0 );
                
                 vec2 texel_size = vec2( 1.0 ) / float( textureSize( shadow_map, 0 ) );
            
                for( float x = -sample_size ; x <= sample_size; x++ )
                {
                    for( float y = -sample_size ; y <= sample_size ; y++ )
                    {
                        float pcfDepth = texture( shadow_map, pos.xy + vec2(x, y) * texel_size ).r;
                        shadow += currentDepth > pcfDepth ? 0.0 : 1.0;
                    }
                }
            
                shadow /= total_samples;
            
                return shadow;
            }
*/
            void main() {

                float fog_start = uCameraFar / 4.0;
                float fog_end = uCameraFar;
                float frag_coord = length( modelViewPos );
                
                
                float d = 1.0 - clamp( (fog_end - frag_coord) / (fog_end - fog_start), 0.0, 1.0 );
                float fade_factor = d;
            
            
            
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
                ambient = 0.5;
                
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
                
                    vec2 texel_size = vec2(1.0) / vec2( textureSize( uShadowMap, 0 ) );
//                    visibility = SmoothShadow( uShadowMap, shadowPos.xyz, 0.0, texel_size );
                    visibility = SampleShadowMapLinear( uShadowMap, shadowPos.xy, shadowPos.z - texel_size.x, texel_size );
                }
                
                colour = (texture_colour * (ambient + (diffuse * visibility))) + (specular * visibility);
                
                out_colour = vec4( mix( colour, vec3(1.0), fade_factor ), 1.0 );
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


        //  Enable attributes
        gl.enableVertexAttribArray( <number>this.bindings.position_attr );
        gl.enableVertexAttribArray( <number>this.bindings.normal_attr );
        gl.enableVertexAttribArray( <number>this.bindings.uvmap_attr );


        //  Activate and Bind Shadow Map
        gl.uniform1i( this.bindings.shadow_map, 1 );        //  Set texture1 shadow map
        gl.activeTexture( gl.TEXTURE1 );                       //  Use shadow map
        gl.bindTexture( gl.TEXTURE_2D, ShadowMap.depth );
    }

    protected class_bindings( vao : VAO, instances : M_Mesh[] ) {

        //  Bind Vertices
        gl.bindBuffer( gl.ARRAY_BUFFER, vao.vertex_buffer );
        gl.vertexAttribPointer( <number>this.bindings.position_attr, 3, gl.FLOAT, false, 0, 0);

        //  Bind Normals
        gl.bindBuffer( gl.ARRAY_BUFFER, vao.normal_buffer );
        gl.vertexAttribPointer( <number>this.bindings.normal_attr, 3, gl.FLOAT, false, 0, 0);

        //  Bind UV Map
        gl.bindBuffer( gl.ARRAY_BUFFER, vao.uvmap_buffer );
        gl.vertexAttribPointer( <number>this.bindings.uvmap_attr, 2, gl.FLOAT, false, 0, 0 );

        //  Bind Faces (and Draw)
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, vao.faces_buffer );


        for( let mesh of instances ) {

            this.instance_bindings( mesh );

            //  Draw
            gl.drawElements( gl.TRIANGLES, vao.face_size, gl.UNSIGNED_SHORT, 0 );
        }
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