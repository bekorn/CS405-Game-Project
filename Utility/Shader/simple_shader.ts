import M_Shader from "./M_shader.js";

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
                originalPosition = vec4(aVertexPosition,1);
                
                projectedPosition =  uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition,1);
                
                gl_Position = projectedPosition;
            }
        `;
    }

    fragment_shader() {
        return `
            precision highp float;
            
            varying vec4 originalPosition;
            varying vec4 projectedPosition;
            
            void main() {
                float local = 4.0;
                float global = 0.0;
                
                vec4 valOfLocal = (0.01 * originalPosition + 0.4)
                                * (0.01 * originalPosition + 0.4)
                                * (0.01 * originalPosition + 0.4)
                                * (0.01 * originalPosition + 0.4);
                                    
                vec4 valOfGlobal = projectedPosition;
                
                vec3 result = valOfLocal.xyz * local
                            + valOfGlobal.xyz * global;
                
                gl_FragColor = vec4( result / (local + global), 1.0 );
            }
        `;
    }

    bindings: { [key: string]: any; };

    constructor() {
        super();

        console.log( "New Shade created" );
    }
}