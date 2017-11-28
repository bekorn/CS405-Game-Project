export class Controller {

    static left: Boolean=false;
    static up: Boolean=false;
    static right: Boolean=false;
    static down: Boolean=false;

    static init_controller() {

        window.addEventListener('keydown', (event) => {

            if (event.keyCode == 37) {
                Controller.left = true
            }
            // console.log(Controller.left);

            if (event.keyCode == 38) {
                Controller.up = true
            }
            // console.log(Controller.up);
            if (event.keyCode == 39) {
                Controller.right = true
            }
            // console.log(Controller.right);
            if (event.keyCode == 40) {
                Controller.down = true
            }
            // console.log(Controller.down);
        });
        window.addEventListener('keyup', (event) => {

            if (event.keyCode == 37) {
                Controller.left = false
            }

            if (event.keyCode == 38) {
                Controller.up = false
            }

            if (event.keyCode == 39) {
                Controller.right = false
            }

            if (event.keyCode == 40) {
                Controller.down = false
            }
        });
    }
}