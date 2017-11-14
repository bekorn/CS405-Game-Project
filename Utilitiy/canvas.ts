import {WebGLUtils} from "./GL/webgl-utils.js";
import {gl} from "../game.js";
import {vec3} from "../Utilitiy/GL/gl-matrix.js";

export default  class Canvas {

    readonly dom : HTMLCanvasElement;
    readonly width : number;
    readonly height : number;
    readonly depth : number;
    readonly w_h_ratio : number;
    readonly w_d_ratio : number;

    constructor( dom_id : string, width : number, height : number, depth : number ) {
        this.dom = <HTMLCanvasElement>document.getElementById( dom_id );
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.w_h_ratio = this.width / this.height;
        this.w_d_ratio = this.width / this.depth;

        window.addEventListener( 'resize', this.refresh.bind( this ) );
    }

    getGL() : WebGLRenderingContext {
        let tempgl = WebGLUtils.setupWebGL(this.dom);
        console.log( tempgl );
        return tempgl;
    }

    to_gl( ...coordinates : number[] ) {
        return vec3.fromValues(
            coordinates[0] / this.width,
            coordinates[1] / this.height,
            coordinates[2] / this.depth
        );
    }

    from_gl(...coordinates : number[] ) {
        return vec3.fromValues(
            coordinates[0] * this.width,
            coordinates[1] * this.height,
            coordinates[2] * this.depth
        );
    }

    // to_gl( x : number, y : number, z : number ) {
    //     return vec3.fromValues(
    //         x / this.width,
    //         y / this.height,
    //         z / this.depth
    //     );
    // }

    refresh() {
        let window_width = document.documentElement.clientWidth;
        let window_height = document.documentElement.clientHeight;

        if( (window_width / this.width) < (window_height / this.height) ) {
            this.dom.width = window_width;
            this.dom.height = this.height * window_width / this.width;
        }
        else {
            this.dom.height = window_height;
            this.dom.width = this.width * window_height / this.height;
        }

        gl.viewport( 0, 0, this.dom.width, this.dom.height );

        // console.log( "Resized to "+ this.dom.width +"x"+ this.dom.height +" (Window: "+ window_width +"x"+ window_height +")" );
    }
}