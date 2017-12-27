import UIElement from "../../Engine/Essentials/ui_element.js";
import TextureLoader from "../../Engine/Texture/texture_loader.js";
import { canvas, time_passed, ui } from "../../Engine/engine.js";
import { vec3 } from '../../Engine/Utility/GL/gl-matrix.js';
import M_Object from "../../Engine/Object/M_Object.js";
import { Controller } from "../../Engine/Utility/controller.js";

export default class Lives extends M_Object {

    hearts : UIElement[] = [];

    lives_left = 3;

    constructor() {
        super( ui );

        const size = 50;

        // const pos = vec3.fromValues( size/canvas.width - 1, size/canvas.height - 1, 0 );
        const pos = vec3.fromValues( 1 - (3.5* size)/canvas.width, 1 - (12.5 * size)/canvas.height, 0 );
        this.model.translate( pos );
        this.model.rotateZ( 180 );

        for( let i=0 ; i<3 ; i++ ) {

            const position = [ 0, (i * 2.5 + 1.5) * size/canvas.height - 1 ];
            const scale = [size/canvas.width, size/canvas.height];

            let heart = <UIElement>this.add_mesh( new UIElement(
                position,
                scale,
                0,
                TextureLoader.loaded_textures[ 'heart' ],
                this )
            );

            heart.model.rotateY( 20 * (i-1) );

            this.hearts.push( heart );
        }
    }

    update( delta_time ) {
        for( let mesh of this.meshes ) {

            mesh.model.rotateY( Math.cos( 3 * time_passed ) * 60 * delta_time );
            mesh.model.translate_global( vec3.fromValues(0, Math.cos( 3 * time_passed ) * 0.1 * delta_time, 0 ) );
            // mesh.model.rotateY( 6 * delta_time );
        }
    }

    lost_one() {

        if( this.lives_left > 0 ) {

            this.hearts[ --this.lives_left ].hide();
        }
    }
}