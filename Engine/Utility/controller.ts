export class Controller {

    static key_map : { key_code : Number, is_down : Boolean };
    static left : Boolean = false;
    static up : Boolean = false;
    static right : Boolean = false;
    static down : Boolean = false;


    static init_controller() {
        window.addEventListener( 'keydown', ( event ) => {

            if( event.keyCode == 37 ) {
                Controller.left = true
            }

            if( event.keyCode == 38 ) {
                Controller.up = true
            }

            if( event.keyCode == 39 ) {
                Controller.right = true
            }
            if( event.keyCode == 40 ) {
                Controller.down = true
            }
        } );

        window.addEventListener( 'keyup', ( event ) => {

            if( event.keyCode == 37 ) {
                Controller.left = false
            }

            if( event.keyCode == 38 ) {
                Controller.up = false
            }

            if( event.keyCode == 39 ) {
                Controller.right = false
            }

            if( event.keyCode == 40 ) {
                Controller.down = false
            }
        } );
    }
}