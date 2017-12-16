import {gl} from "../engine.js";

export default abstract class M_Shader {

    abstract vertex_shader() : string;
    abstract fragment_shader() : string;

    abstract binding_map : { [key : string] : string };
    bindings : { [key : string] : WebGLUniformLocation } = {};

    program : WebGLProgram;

    constructor() {
        this.program = M_Shader.init_shaders( this.vertex_shader(), this.fragment_shader() );
    }

    // Initialize a shader program, so WebGL knows how to draw our data
    private static init_shaders( vsSource, fsSource) {

        const vertexShader = M_Shader.load_shader(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = M_Shader.load_shader(gl.FRAGMENT_SHADER, fsSource);

        // Create the shader program
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    // Create a shader of the given type, uploads the source and compiles it.
    private static load_shader(type, source) {
        const shader = gl.createShader(type);

        // Send the source to the shader object
        gl.shaderSource(shader, source);

        // Compile the shader program
        gl.compileShader(shader);

        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    protected bind_program() {

        for( let key in this.binding_map ) {

            const location = this.binding_map[ key ];

            if( location[0] == 'a' ) {  //  It is an attribute location

                this.bindings[ key ] = gl.getAttribLocation( this.program, location );
            }
            else if( location[0] == 'u' ) {

                this.bindings[ key ] = gl.getUniformLocation( this.program, location );
            }
        }
    }
}