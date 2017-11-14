import {gl} from "../game.js";
import M_Shape from "./M_shape.js";
import {vec3, mat4} from "../Utility/GL/gl-matrix.js";
import M_Shader from "../Utility/Shader/M_shader";

export class Circle extends M_Shape {

    radius : number;
    detail : number;

    constructor( shader : M_Shader, radius : number, detail : number ) {
        super( shader );
        this.radius = radius;
        this.detail = detail * 4;
    }

    vertices(): vec3[]  {
        const vertices : vec3[] = [];
        vertices.push( vec3.fromValues( 0, 0, 0 ) );
        for( let i=0 ; i<this.detail ; i++ ) {
            const x = this.radius * Math.cos( 2 * Math.PI * i / this.detail);
            const y = this.radius * Math.sin( 2 * Math.PI * i / this.detail);
            vertices.push( vec3.fromValues( x, y, 0 ) );
        }

        return vertices;
    }

    indices(): Float32Array {
        const size = this.detail * 3;
        let indices = new Float32Array( size );
        for( let i=0 ; i<this.detail-1 ; i++ ) {
            indices[i  ] = 0;
            indices[i+1] = i+1;
            indices[i+2] = i+2;
        }
        indices[size  ] = 0;
        indices[size+1] = 1;
        indices[size+2] = this.detail;

        return new Float32Array( indices );
    }

    draw( model : mat4 ) {

        mat4.multiply( model, model, this.model );

        gl.useProgram( this.shader.program );

        gl.uniformMatrix4fv( this.shader.bindings.model, false, model );



        gl.bindBuffer( gl.ARRAY_BUFFER, this.vao );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.ebo );
        gl.enableVertexAttribArray( this.vao_attr );
        gl.vertexAttribPointer( this.vao_attr, 3, gl.FLOAT, false, 0, 0 );

        gl.drawElements( gl.TRIANGLES, this.detail*3, gl.UNSIGNED_SHORT, 0 );
    }
}