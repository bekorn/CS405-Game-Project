
export default class MeshLoader {

    static loaded_meshes : { [key: string] : Object } = {};

    static to_load : string[] = [
        "cube",
        "Axes",
        "deer"
    ];

    static async load( file_name : string ) : Promise<any> {

        let myRequest = new Request('Assets/Meshes/' + file_name.toString() + '.json');

        return fetch( myRequest )
            .then( (response) => response.json() )
            .then( (json) => {
                MeshLoader.loaded_meshes[ file_name ] = json;

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