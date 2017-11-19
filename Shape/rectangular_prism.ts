import M_Shape from "./M_shape.js";
import {glMatrix, vec3, mat4} from "../Utility/GL/gl-matrix.js";
import M_Shader from "../Utility/Shader/M_shader.js";
import {gl, camera, projection_matrix} from "../game.js";

export default class RectangularPrism extends M_Shape {

    vertices(): vec3[] {
        return [
            vec3.fromValues(+1, +1, +1),
            vec3.fromValues(-1, +1, +1),
            vec3.fromValues(-1, -1, +1),
            vec3.fromValues(+1, -1, +1),
            vec3.fromValues(+1, +1, -1),
            vec3.fromValues(-1, +1, -1),
            vec3.fromValues(-1, -1, -1),
            vec3.fromValues(+1, -1, -1)
        ]
    }

    indices(): Float32Array {
        return new Float32Array([
            0, 1, 2, 2, 3, 0,
            0, 4, 5, 5, 1, 0,
            4, 7, 6, 6, 5, 4,
            7, 3, 2, 2, 6, 7,
            1, 5, 6, 6, 2, 1,
            0, 4, 7, 7, 3, 0
        ]);
    }

    scale: vec3;

    constructor( shader : M_Shader, dimensions : vec3 ) {
        super( shader );

        // this.scale = scale;

        this.model = mat4.create();
        mat4.rotateZ( this.model, this.model, glMatrix.toRadian(0.1) );
        mat4.rotateX( this.model, this.model, glMatrix.toRadian(0.14) );

        // mat4.scale( this.model, this.model, scale );

        this.shader.bindings.model_view = gl.getUniformLocation( this.shader.program, 'uModelViewMatrix' );
        this.shader.bindings.projection = gl.getUniformLocation( this.shader.program, 'uProjectionMatrix' );

        this.vao = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, this.vao );


        //  Prepare Vertices
        let raw_vertices = this.vertices();
        raw_vertices = this.apply_dimensions( raw_vertices, vec3.scale( vec3.create(), dimensions, 0.5 ) );

        const vertices : Float32Array = new Float32Array( raw_vertices.length * 3 );
        for( let i=0 ; i < raw_vertices.length ; i++ ) {
            vertices[i*3  ] = raw_vertices[i][0];
            vertices[i*3+1] = raw_vertices[i][1];
            vertices[i*3+2] = raw_vertices[i][2];
        }

        gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );


        //  vao_attr
        this.shader.bindings.vao_attr = gl.getAttribLocation(this.shader.program, 'aVertexPosition');
        gl.enableVertexAttribArray(this.shader.bindings.vao_attr);
        gl.vertexAttribPointer(this.shader.bindings.vao_attr, 3, gl.FLOAT, false, 0, 0);


        //  Prepare indices
        let indices = this.indices();
        this.indice_size = indices.length;

        this.ebo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    draw( parent_model : mat4 ) {

        let model = mat4.clone( parent_model );

        super.draw( model );

        mat4.multiply( model, model, this.model );

        gl.useProgram( this.shader.program );

        gl.uniformMatrix4fv( this.shader.bindings.model_view, false, new Float32Array( model ));

        gl.uniformMatrix4fv( this.shader.bindings.projection, false, new Float32Array(projection_matrix));

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vao );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.ebo );
        gl.enableVertexAttribArray( this.shader.bindings.vao_attr );
        gl.vertexAttribPointer( this.shader.bindings.vao_attr, 3, gl.FLOAT, false, 0, 0 );

        gl.drawElements( gl.TRIANGLES, this.indice_size, gl.UNSIGNED_SHORT, 0 );
    }
}