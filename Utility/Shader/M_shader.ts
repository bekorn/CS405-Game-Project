import {gl} from "../../game.js";

export default abstract class M_Shader {

    abstract vertex_shader() : string;
    abstract fragment_shader() : string;
    program : WebGLProgram;
    bindings : { [key : string] : any };

    constructor( ) {
        this.program = this.init_shaders( this.vertex_shader(), this.fragment_shader() );
        this.bindings = {};
    }

    //	Initialize a shader program from script elements on the HTML
    // private init_dom_shaders( vertex_id : string, fragment_id : string ) : WebGLProgram {
    //
    //     let vertex : WebGLShader;
    //     let fragment : WebGLShader;
    //
    //     let vertex_dom : HTMLScriptElement = <HTMLScriptElement>document.getElementById( vertex_id );
    //
    //     if ( !vertex_dom ) {
    //         alert( "Unable to load vertex shader " + vertex_id );
    //         return -1;
    //     }
    //
    //     const fragment_dom : HTMLScriptElement = <HTMLScriptElement>document.getElementById( fragment_id );
    //
    //     if ( !fragment_dom ) {
    //         alert( "Unable to load vertex shader " + fragment_id );
    //         return -1;
    //     }
    //
    //     return init_shaders( vertex_dom.text, fragment_dom.text );
    // }

    // Initialize a shader program, so WebGL knows how to draw our data
    private init_shaders( vsSource, fsSource) {

        const vertexShader = this.load_shader(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.load_shader(gl.FRAGMENT_SHADER, fsSource);

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
    private load_shader(type, source) {
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
}