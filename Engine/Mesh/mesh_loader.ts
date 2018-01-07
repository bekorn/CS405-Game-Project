import { gl } from "../engine.js";

type Data = {
    vertices : Float32Array,
    normals : Float32Array,
    uvmap : Float32Array,
    faces : Uint16Array,
};

export type VAOWrapper = {
    vao : WebGLVertexArrayObject,
    face_size : number
};

export default class MeshLoader {

    static loaded_meshes : { [key: string] : VAOWrapper } = {};

    static to_load : string[] = [
        "plane",
        "cube",
        // "Axes",
        "deer",
    ];

    static async load_all() : Promise<any> {

        console.log( "Started Loading Meshes" );
        // return Promise.all( MeshLoader.to_load.map( (file) => MeshLoader.load( file ) ) );
        for( const file of MeshLoader.to_load ) {

            await MeshLoader.load( file );
        }
    }

    static async load( file_name : string ) : Promise<any> {

        let myRequest = new Request('Assets/Meshes/' + file_name.toString() + '.json');

        return fetch( myRequest )
            .then( (response) => response.json() )
            .then( (json) => {

                const data = MeshLoader.extract_data( json );

                const vao = gl.createVertexArray();
                gl.bindVertexArray( vao );

                //  Buffers will be saved to teh bounded vao
                MeshLoader.bind_buffers( data );

                //  Nullify binding
                gl.bindVertexArray( null );

                //  Save vao and size
                MeshLoader.loaded_meshes[ file_name ] = {
                    vao : vao,
                    face_size : data.faces.length
                };

                //  Log the progress of loading
                const loaded = Object.keys( MeshLoader.loaded_meshes ).length;
                const all = MeshLoader.to_load.length;
                console.log( '[' + loaded.toString() + '/' + all.toString() + '] Loaded : ' + file_name );
            } );
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

    static flatten(arr) {
        return arr.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? MeshLoader.flatten(toFlatten) : toFlatten);
        }, []);
    }

    private static bind_buffers( data : Data ) {

        //  Prepare Vertices
        const vertex_buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );
        gl.bufferData( gl.ARRAY_BUFFER, data.vertices, gl.STATIC_DRAW );
        gl.vertexAttribPointer( 0, 3, gl.FLOAT, false, 0, 0);

        //  Prepare Normals
        const normal_buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, normal_buffer );
        gl.bufferData( gl.ARRAY_BUFFER, data.normals, gl.STATIC_DRAW );
        gl.vertexAttribPointer( 1, 3, gl.FLOAT, false, 0, 0);

        //  Prepare UV Map
        const uvmap_buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, uvmap_buffer );
        gl.bufferData( gl.ARRAY_BUFFER, data.uvmap, gl.STATIC_DRAW );
        gl.vertexAttribPointer( 2, 2, gl.FLOAT, false, 0, 0 );


        //  Enable attributes
        gl.enableVertexAttribArray( 0 );
        gl.enableVertexAttribArray( 1 );
        gl.enableVertexAttribArray( 2 );


        //  Prepare faces
        const faces_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faces_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.faces, gl.STATIC_DRAW);
    }
}