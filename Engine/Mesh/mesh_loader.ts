import { gl } from "../engine.js";

type Data = {
    vertices : Float32Array,
    normals : Float32Array,
    uvmap : Float32Array,
    faces : Uint16Array,
};

export type VAO = {
    vertex_buffer : WebGLBuffer,
    normal_buffer : WebGLBuffer,
    uvmap_buffer : WebGLBuffer,
    faces_buffer : WebGLBuffer,
    face_size : number
};

export default class MeshLoader {

    static loaded_meshes : { [key: string] : VAO } = {};

    static to_load : string[] = [
        "plane",
        "cube",
        // "Axes",
        "deer",
    ];

    private static bind_buffers( data : Data ) : VAO {

        //  Prepare Vertices
        const vertex_buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );
        gl.bufferData( gl.ARRAY_BUFFER, data.vertices, gl.STATIC_DRAW );


        //  Prepare Normals
        const normal_buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, normal_buffer );
        gl.bufferData( gl.ARRAY_BUFFER, data.normals, gl.STATIC_DRAW );


        //  Prepare UV Map
        const uvmap_buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, uvmap_buffer );
        gl.bufferData( gl.ARRAY_BUFFER, data.uvmap, gl.STATIC_DRAW );


        //  Nullify binding
        gl.bindBuffer( gl.ARRAY_BUFFER, null );


        //  Prepare faces
        const faces_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faces_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.faces, gl.STATIC_DRAW);


        //  Nullify binding
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );

        return {
            vertex_buffer : vertex_buffer,
            normal_buffer : normal_buffer,
            uvmap_buffer : uvmap_buffer,
            faces_buffer : faces_buffer,
            face_size : data.faces.length
        };
    }

    static extract_data( json : JSON ) : Data {

        return {

            vertices : new Float32Array(
                json[ "meshes" ][ 0 ][ "vertices" ]
            ),

            faces : new Uint16Array(
                MeshLoader.flatten(
                    json[ "meshes" ][ 0 ][ "faces" ]
                )
            ),

            normals : new Float32Array(
                json[ "meshes" ][ 0 ][ "normals" ]
            ),

            uvmap : new Float32Array(
                json[ "meshes" ][ 0 ][ "texturecoords" ][ 0 ]
            )
        };
    }

    static async load( file_name : string ) : Promise<any> {

        let myRequest = new Request('Assets/Meshes/' + file_name.toString() + '.json');

        return fetch( myRequest )
            .then( (response) => response.json() )
            .then( (json) => {

                const data = MeshLoader.extract_data( json );
                const vao = MeshLoader.bind_buffers( data );

                MeshLoader.loaded_meshes[ file_name ] = vao;

                //  Log the progress of loading
                const loaded = Object.keys( MeshLoader.loaded_meshes ).length;
                const all = MeshLoader.to_load.length;
                console.log( '[' + loaded.toString() + '/' + all.toString() + '] Loaded : ' + file_name );
            } );
    }

    static async load_all() : Promise<any> {

        console.log( "Started Loading Meshes" );
        return Promise.all( MeshLoader.to_load.map( (file) => MeshLoader.load( file ) ) );
    }

    static flatten(arr) {
        return arr.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? MeshLoader.flatten(toFlatten) : toFlatten);
        }, []);
    }
}