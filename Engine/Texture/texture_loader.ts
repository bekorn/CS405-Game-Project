import { gl } from "../engine.js";

export default class TextureLoader {

    static loaded_textures : { [key: string] : WebGLTexture } = {};

    static to_load : string[][] = [
        [ 'heart', 'png' ],
        [ 'Brick Wall', 'jpg' ],
        [ 'Wooden Floor', 'jpg' ],
        [ 'Wooden Box', 'png' ],
        [ 'Wooden Box Damaged', 'jpg' ],
        [ 'galvanized plate with bolts', 'jpg' ],
        [ 'galvanized plate', 'jpg' ],
        [ 'Stone texture', 'jpg' ],
        [ 'HardMetal', 'jpg' ],
    ];

    static extension : EXT_texture_filter_anisotropic;
    static max_anisotropic;

    static async load( file : string[] ) : Promise<any> {

        //  Promise will resolve when the image is loaded
        return new Promise( (resolve) => {

            const image = new Image();
            image.onload = function() {

                //  Create texture
                const texture = gl.createTexture();
                gl.bindTexture( gl.TEXTURE_2D, texture );

                //  Bind Loaded image
                gl.texImage2D( gl.TEXTURE_2D,
                    0 /* level */,
                    gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                    image );

                // gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
                // gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );

                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
                gl.texParameterf( gl.TEXTURE_2D, TextureLoader.extension.TEXTURE_MAX_ANISOTROPY_EXT, TextureLoader.max_anisotropic );
                gl.generateMipmap( gl.TEXTURE_2D );

                gl.bindTexture( gl.TEXTURE_2D, null );

                TextureLoader.loaded_textures[ file[0] ] = texture;

                const loaded = Object.keys( TextureLoader.loaded_textures ).length;
                const all = TextureLoader.to_load.length;
                console.log( '[' + loaded + '/' + all + '] Loaded : ' + file[0] + '.' + file[1] );

                resolve();
            };

            image.src = 'Assets/Textures/' + file[0] + '.' + file[1];
        } );
    }

    static async load_all() : Promise<any> {

        TextureLoader.extension = gl.getExtension('EXT_texture_filter_anisotropic');
        TextureLoader.max_anisotropic = gl.getParameter( TextureLoader.extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT );

        console.log( "Started Loading Textures" );
        return Promise.all( TextureLoader.to_load.map( (file) => TextureLoader.load( file ) ) );
    }

    static isPowerOf2(value) : boolean {
        return (value & (value - 1)) == 0;
    }
}