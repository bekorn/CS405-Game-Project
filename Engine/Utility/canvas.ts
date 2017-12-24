import {gl} from "../engine.js";
import ShadowMap from "./shadow_map.js";

export default class Canvas {

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

    getGL() : WebGL2RenderingContext {

        return this.dom.getContext( 'webgl2', {
            alpha : false,
            depth : true,
            stencil : false,
            antialias : true
        } );
    }

    refresh() {
        let window_width = document.documentElement.clientWidth;
        let window_height = document.documentElement.clientHeight;

        if( (window_width / this.width) < (window_height / this.height) ) {
            this.dom.width = Math.round( window_width );
            this.dom.height = Math.round( this.height * window_width / this.width );
        }
        else {
            this.dom.height = Math.round( window_height );
            this.dom.width = Math.round( this.width * window_height / this.height );
        }

        // gl.viewport( 0, 0, this.dom.width, this.dom.height );
        // ShadowMap.viewport( Math.ceil( this.dom.clientWidth ), Math.ceil( this.dom.clientHeight ) );

        // console.log( "Resized to "+ this.dom.width +"x"+ this.dom.height +" (Window: "+ window_width +"x"+ window_height +")" );
    }
}