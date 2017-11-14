import {gl} from "../../game.js";

export class ProgramInfo {

	program : WebGLProgram;
	binding : { [index : string] : WebGLUniformLocation };
    set_bindings : Function;

	constructor( program : WebGLProgram ) {
		this.program = program;
		this.set_bindings = null;
		this.binding = {};
	}

	uniform_bind( key : string, key_on_shader : string ) {
		this.binding[ key ] = gl.getUniformLocation( this.program, key_on_shader );
	}
}


