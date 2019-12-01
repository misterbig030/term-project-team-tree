window.Cylinder = window.classes.Cylinder =
    class Cylinder extends Shape
    { constructor( rows, columns )
    { super( "positions", "normals", "texture_coords" );
        const lower = Array( rows ).fill( Vec.of( 0,0,0 ) )
            .map( (p,i,a) => Mat4.translation([ 0.05 * i/(a.length-1),0,0 ])
                .times( p.to4(1) ).to3() );
        const side = Array( rows ).fill( Vec.of( 0.05,0,0 ) )
            .map( (p,i,a) => Mat4.translation([ 0,1*(i/(a.length-1)),0 ])
                .times( p.to4(1) ).to3() );
        const upper = Array( rows ).fill( Vec.of( 0.05,1,0 ) )
            .map( (p,i,a) => Mat4.translation([ -0.1*(i/(a.length-1)),0,0])
                .times( p.to4(1) ).to3() );


        const rect = (lower.concat(side)).concat(upper);



        Surface_Of_Revolution_Y.insert_transformed_copy_into( this, [ rows, columns, rect ] );
    } }


window.Grass_1 = window.classes.Grass_1 =
    class Grass_1 extends Shape
    { constructor( rows, columns )
    { super( "positions", "normals", "texture_coords" );
        Grass.insert_transformed_copy_into(this, [rows, columns]);
        for (let i=0; i<this.positions.length; i++){
            this.positions[i][0] = 0.5 * this.positions[i][1] ** 2;
        }
    } }

window.Grass_2 = window.classes.Grass_2 =
    class Grass_2 extends Shape
    { constructor( rows, columns )
    { super( "positions", "normals", "texture_coords" );
        Grass.insert_transformed_copy_into(this, [rows, columns]);
        for (let i=0; i<this.positions.length; i++){
            this.positions[i][0] = -0.5 * this.positions[i][1] ** 2;
        }
    } }
