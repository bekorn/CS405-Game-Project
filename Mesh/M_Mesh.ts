import {vec3, mat4} from "../Utility/GL/gl-matrix.js";
import M_Shader from "../Utility/Shader/M_shader.js";
import Model from "../Utility/model.js";
import M_Object from "../Object/M_Object.js";
import { camera, gl, light, projection_matrix } from "../game.js";

export default abstract class M_Mesh {

    static id : number = 0;
    id : number = M_Mesh.id++;

    parent : M_Object = null;
    model : Model = new Model( this );
    shader : M_Shader;

    vertex_buffer : WebGLBuffer;
    vertex_size : number;
    faces_buffer : WebGLBuffer;
    face_size : number;
    normal_buffer : WebGLBuffer;
    normal_size : number;

    abstract vertices() : Float32Array;
    abstract faces() : Uint16Array;
    abstract normals(): Float32Array;

    constructor( shader: M_Shader ) {

        this.shader = shader;
    }

    protected init_mesh() {

        //  Prepare Vertices
        const vertices = this.vertices();
        this.vertex_size = vertices.length;

        this.vertex_buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertex_buffer );
        gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

        //  Prepare faces
        const faces = this.faces();
        this.face_size = faces.length;

        this.faces_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faces_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);


        //  Prepare Normals
        const normals = this.normals();
        this.normal_size = normals.length;

        this.normal_buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, this.normal_buffer );
        gl.bufferData( gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW );


        //  Enable attributes
        gl.enableVertexAttribArray( <number>this.shader.bindings.position_attr );
        gl.enableVertexAttribArray( <number>this.shader.bindings.normal_attr );

        //  Set binding to some other thing (null)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    async draw( parent_model : mat4 ) {
        // console.log( "Drawing SHAPE:"+ this.id );

        let model = mat4.clone( parent_model );

        mat4.multiply( model, model, this.model.get_model() );


        gl.useProgram( this.shader.program );

        gl.uniformMatrix4fv( this.shader.bindings.model_matrix, false, new Float32Array( model ) );
        gl.uniformMatrix4fv( this.shader.bindings.view_matrix, false, new Float32Array( camera.view_matrix ) );
        gl.uniformMatrix4fv( this.shader.bindings.projection_matrix, false, new Float32Array( projection_matrix ) );

        gl.uniform3fv( this.shader.bindings.light_position, new Float32Array( light ) );
        gl.uniform3fv( this.shader.bindings.camera_position, new Float32Array( camera.model.global_position() ) );

        //  Bind Vertices
        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertex_buffer );
        gl.vertexAttribPointer( <number>this.shader.bindings.position_attr, 3, gl.FLOAT, false, 0, 0);

        //  Bind Normals
        gl.bindBuffer( gl.ARRAY_BUFFER, this.normal_buffer );
        gl.vertexAttribPointer( <number>this.shader.bindings.normal_attr, 3, gl.FLOAT, false, 0, 0);

        //  Bind Faces (and Draw)
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.faces_buffer );
        gl.drawElements( gl.TRIANGLES, this.face_size, gl.UNSIGNED_SHORT, 0 );
    };
}