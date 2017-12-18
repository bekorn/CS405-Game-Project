import { gl } from "../engine.js";

export default class TextureLoader {

    static loaded_textures : { [key: string] : WebGLTexture } = {};

    static to_load : string[] = [
        'mlg_frog',
        'creeper',
        'kreygasm',
        'simple',
        'krabs',
    ];

    static async load( file_name : string ) : Promise<any> {

        //  Promise will resolve when the image is loaded
        return new Promise( (resolve) => {

            const image = new Image();
            image.onload = function() {

                //  Create texture
                const texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);

                //  Bind Loaded image
                gl.texImage2D( gl.TEXTURE_2D,
                    0 /* level */,
                    gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                    image );

                // WebGL1 has different requirements for power of 2 images
                // vs non power of 2 images so check if the image is a
                // power of 2 in both dimensions.
                if (TextureLoader.isPowerOf2(image.width)  &&  TextureLoader.isPowerOf2(image.height)) {
                    // Yes, it's a power of 2. Generate mips.
                    gl.generateMipmap(gl.TEXTURE_2D);
                } else {
                    // No, it's not a power of 2. Turn of mips and set
                    // wrapping to clamp to edge
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                    //  Makes the texture repeat (like uvmap mod 1)
                    //  https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
                    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                }

                TextureLoader.loaded_textures[ file_name ] = texture;

                const loaded = Object.keys( TextureLoader.loaded_textures ).length;
                const all = TextureLoader.to_load.length;
                console.log( '[' + loaded.toString() + '/' + all.toString() + '] Loaded : ' + file_name );

                resolve();
            };

            image.src = 'Assets/Textures/' + file_name + '.jpg';
        } );
    }

    static async load_all() : Promise<any> {

        console.log( "Started Loading Textures" );
        return Promise.all( TextureLoader.to_load.map( (file) => TextureLoader.load( file ) ) );
    }

    static isPowerOf2(value) : boolean {
        return (value & (value - 1)) == 0;
    }
}