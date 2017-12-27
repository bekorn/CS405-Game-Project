import { vec3 } from "../../Engine/Utility/GL/gl-matrix.js";

export default class AABB {

    center : vec3;
    dimensions : vec3;  //  Actually HALF dimensions

    constructor( center : vec3, dimensions : vec3 ) {

        this.center = center;
        this.dimensions = dimensions;
    }

    update_pos( center : vec3 ) : void {

        this.center = center;
    }

    collides_with( bbox : AABB ) : boolean {

        const x = AABB.linear_collision(
            this.center[0] - this.dimensions[0], this.center[0] + this.dimensions[0],
            bbox.center[0] - bbox.dimensions[0], bbox.center[0] + bbox.dimensions[0] );

        const y = AABB.linear_collision(
            this.center[1] - this.dimensions[1], this.center[1] + this.dimensions[1],
            bbox.center[1] - bbox.dimensions[1], bbox.center[1] + bbox.dimensions[1] );

        const z = AABB.linear_collision(
            this.center[2] - this.dimensions[2], this.center[2] + this.dimensions[2],
            bbox.center[2] - bbox.dimensions[2], bbox.center[2] + bbox.dimensions[2] );
        
        return x && y && z;
    }

    collides_with_speed( bbox : AABB, velocity : vec3 ) : boolean[] {

        const first_pos = vec3.clone( this.center );
        const future_pos = vec3.add( vec3.fromValues(0,0,0), first_pos, velocity );

        //  Present Collision
        const x = AABB.linear_collision(
            first_pos[0] - this.dimensions[0], first_pos[0] + this.dimensions[0],
            bbox.center[0] - bbox.dimensions[0], bbox.center[0] + bbox.dimensions[0] );

        const y = AABB.linear_collision(
            first_pos[1] - this.dimensions[1], first_pos[1] + this.dimensions[1],
            bbox.center[1] - bbox.dimensions[1], bbox.center[1] + bbox.dimensions[1] );

        const z = AABB.linear_collision(
            first_pos[2] - this.dimensions[2], first_pos[2] + this.dimensions[2],
            bbox.center[2] - bbox.dimensions[2], bbox.center[2] + bbox.dimensions[2] );


        //  Future Collision
        const fx = AABB.linear_collision(
            future_pos[0] - this.dimensions[0], future_pos[0] + this.dimensions[0],
            bbox.center[0] - bbox.dimensions[0], bbox.center[0] + bbox.dimensions[0] );

        const fy = AABB.linear_collision(
            future_pos[1] - this.dimensions[1], future_pos[1] + this.dimensions[1],
            bbox.center[1] - bbox.dimensions[1], bbox.center[1] + bbox.dimensions[1] );

        const fz = AABB.linear_collision(
            future_pos[2] - this.dimensions[2], future_pos[2] + this.dimensions[2],
            bbox.center[2] - bbox.dimensions[2], bbox.center[2] + bbox.dimensions[2] );

        return [
            fx &&  y &&  z,
            x  && fy &&  z,
            x  &&  y && fz,
            fx && fy && fz
        ];
    }

    private static linear_collision( range1_min : number, range1_max : number, range2_min : number, range2_max : number ) : boolean {

        return ! (range2_max <= range1_min  ||  range1_max <= range2_min );
    }

    static stop_movement( response : boolean[], velocity : vec3 ) {

        for( let i=0 ; i<3 ; i++ ) {

            if( response[ i ] ) {

                velocity[ i ] = 0;
            }
        }
    }

    stick_to( bbox : AABB, collision : boolean[], velocity : vec3 ) {

        for( let i=0 ; i<3 ; i++ ) {

            //  If the collision happens on this axes
            //  This means velocity is larger than the gap between edges
            if( collision[i] ) {

                const center_dist = Math.abs( this.center[i] - bbox.center[i] );
                const edge_dist = center_dist - this.dimensions[i] - bbox.dimensions[i];

                velocity[i] = Math.sign( velocity[i] ) * edge_dist;
            }
        }
    }
}