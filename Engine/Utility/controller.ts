type key_status = {
    is_down : boolean,
    just_pressed : boolean,
};

export class Controller {

    static key_map : { [key_code : number] : string } = {
        37: 'left',
        38 : 'up',
        39 : 'right',
        40 : 'down',
        76 : 'depth_debug', //  L

        87 : 'w',
        65 : 'a',
        83 : 's',
        68 : 'd',

        81 : 'q',
        69 : 'e',

        32 : 'space',
    };

    static keys : key_status[] = [];

    static init_controller() {

        for( const key of Object.keys( Controller.key_map ) ) {

            Controller.keys[ Controller.key_map[ key ] ] = {
                is_down : false,
                just_pressed : false
            };
        }

        console.log( Controller.keys );

        window.addEventListener( 'keydown', ( event ) => {

            const key_name = Controller.key_map[ event.keyCode ];

            if( key_name in Controller.keys ) {

                if( ! Controller.keys[ key_name ].is_down ) {

                    Controller.keys[ key_name ].just_pressed = true;
                }

                Controller.keys[ key_name ].is_down = true;
            }
        } );

        window.addEventListener( 'keyup', ( event ) => {

            const key_name = Controller.key_map[ event.keyCode ];

            if( key_name in Controller.keys ) {
                Controller.keys[key_name].is_down = false;
            }
        } );
    }

    static clear_just_pressed_keys() {

        for( let key in Controller.keys ) {
            Controller.keys[ key ].just_pressed = false;
        }
    }
}