import {canvas, gl} from "../game.js";
import {vec3, mat4} from "../Utilitiy/GL/gl-matrix.js";
import M_Shader from "../Utilitiy/Shader/M_shader";

export default abstract class M_Shape {

    static id : number = 0;
    id : number = M_Shape.id++;

    shader : M_Shader;
    vao : WebGLBuffer;
    vao_attr : number;
    ebo : WebGLBuffer;
    indice_size : number;
    model : mat4;

    abstract vertices() : vec3[];

    abstract indices() : Float32Array;

    constructor( shader: M_Shader ) {

        // this.model = mat4.identity( mat4.create() );
        this.shader = shader;
        //
        // this.vao = gl.createBuffer();
        // gl.bindBuffer( gl.ARRAY_BUFFER, this.vao );
        //
        // const raw_vertices = this.vertices();
        //
        // const vertices = this.fit_to_canvas( raw_vertices );
        //
        // const vertices_array : Float32Array = new Float32Array( vertices.length * 3 );
        //
        // for( let i=0 ; i < vertices.length ; i++ ) {
        //     vertices_array[i  ] = vertices[i][0];
        //     vertices_array[i+1] = vertices[i][1];
        //     vertices_array[i+2] = vertices[i][2];
        // }
        //
        //
        // gl.bufferData( gl.ARRAY_BUFFER, vertices_array, gl.STATIC_DRAW );
        //
        // this.vao_attr = gl.getAttribLocation( this.shader.program, 'vPosition' );
        // gl.enableVertexAttribArray( this.vao_attr );
        // gl.vertexAttribPointer( this.vao_attr, 2, gl.FLOAT, false, 0, 0 );
        //
        //
        // const indices = this.indices();
        //
        // this.ebo = gl.createBuffer();
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        //
        // gl.bindBuffer( gl.ARRAY_BUFFER, null );
    }

    protected fit_to_canvas( raw_vertices: vec3[] ) : vec3[] {
        return raw_vertices.map( (vertex) => {
            vertex[0] *= 2 / canvas.width;
            vertex[1] *= 2 / canvas.height;
            vertex[2] *= 2 / canvas.depth;
            return vertex;
        })
    }

    protected apply_dimensions( vertices: vec3[], dimensions: vec3 ) {
        return vertices.map( (vertex) => {
            return vec3.multiply( vertex, vertex, dimensions );
        })
    }

    draw( parent_model : mat4 ) {
        // console.log( "Drawing SHAPE:"+ this.id );
    };
}