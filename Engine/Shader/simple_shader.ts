import M_Shader from "./M_shader.js";
import { gl } from "../engine";

export default class SimpleShader extends M_Shader {

    vertex_shader() {
        return `
            precision highp float;
            
            attribute vec3 aVertexPosition;
        
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            
            varying vec4 originalPosition;
            varying vec4 projectedPosition;
            
            void main() {
            
                originalPosition = vec4(aVertexPosition,1.0);
                
                projectedPosition =  uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition,1);
                
                gl_Position = projectedPosition;
            }
        `;
    }

    fragment_shader() {
        return `
            precision mediump float;
            
            varying vec4 originalPosition;
            varying vec4 projectedPosition;
            
            void main() {
                vec3 light = vec3( 1.0, 1.0, 1.0 );
                
                vec3 colour = pow( (originalPosition.xyz), vec3( 3.0 ) );
                
                gl_FragColor = vec4( colour, 1.0 );
            }
        `;
    }

    binding_map : { [key: string]: any } = {
        model_view : 'uModelViewMatrix',
        projection : 'uProjectionMatrix',
        position_attr : 'aVertexPosition'
    };

    constructor() {
        super();

        this.bind_program();

        console.log( "SimpleShader created" );
    }
}