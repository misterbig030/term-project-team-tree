window.Cylinder = window.classes.Cylinder =
    class Cylinder extends Shape
    { constructor( rows, columns )
    { super( "positions", "normals", "texture_coords" );
        const lower = Array( rows ).fill( Vec.of( 0,0,0 ) )
            .map( (p,i,a) => Mat4.translation([ i/(a.length-1),0,0 ])
                .times( p.to4(1) ).to3() );
        const side = Array( rows ).fill( Vec.of( 1,0,0 ) )
            .map( (p,i,a) => Mat4.translation([ 0,2*(i/(a.length-1)),0 ])
                .times( p.to4(1) ).to3() );
        const upper = Array( rows ).fill( Vec.of( 1,2,0 ) )
            .map( (p,i,a) => Mat4.translation([ -1*(i/(a.length-1)),0,0])
                .times( p.to4(1) ).to3() );


        const rect = (lower.concat(side)).concat(upper);



        Surface_Of_Revolution_Y.insert_transformed_copy_into( this, [ rows, columns, rect ] );
    } }

