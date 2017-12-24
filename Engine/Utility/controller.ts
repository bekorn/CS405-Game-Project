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
    static left : Boolean = false;
    static up : Boolean = false;
    static right : Boolean = false;
    static down : Boolean = false;
    static depth_debug : Boolean = false;
    static w : Boolean = false;
    static a : Boolean = false;
    static s : Boolean = false;
    static d : Boolean = false;
    static q : Boolean = false;
    static e : Boolean = false;
    static space : Boolean = false;

    static init_controller() {
        window.addEventListener( 'keydown', ( event ) => {

            const key_name = Controller.key_map[ event.keyCode ];
            Controller[ key_name ] = true;
        } );

        window.addEventListener( 'keyup', ( event ) => {

            const key_name = Controller.key_map[ event.keyCode ];
            Controller[ key_name ] = false;
        } );
    }
}