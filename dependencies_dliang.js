window.Apple = window.classes.Apple =
    class Apple extends Shape
    { constructor( rows, columns )
    { super( "positions", "normals", "texture_coords" );
        let half_heart_points = Array( rows ).fill( Vec.of( 0,0,0 ) )
            .map( (p,i,a) => Mat4.rotation(i/(a.length-1) * Math.PI, Vec.of(0,0,-1))
                .times(Mat4.translation([0,0.3 + 0.1 * Math.sin(i/(a.length-1) * Math.PI ), 0]))
                .times(p.to4(1)).to3());
        Surface_Of_Revolution_Y.insert_transformed_copy_into( this, [ rows, columns, half_heart_points ] );
    } };

window.Grass = window.classes.Grass =
    class Grass extends Shape
    { constructor( rows, columns )
    { super( "positions", "normals", "texture_coords" );
        let length = 2;
        let width = 0.1;
        let points = Array( rows ).fill(Vec.of(0,0,0))
            .map( (p,i,a) =>
                Mat4.translation([width * Math.sin(i/(a.length-1) * Math.PI), i/(a.length-1) * length,0])
                    .times(p.to4(1)).to3());
        Surface_Of_Revolution_Y.insert_transformed_copy_into( this, [ rows, columns, points ] );
    } };

window.Row_Grass = window.classes.Row_Grass = class Row_Grass extends Shape{
    constructor(rows, columns) {
        super("position", "normals", "texture_coords");
        let grass = new Grass(rows, columns);

    }
}


window.Cube = window.classes.Cube =
    class Cube extends Shape    // A cube inserts six square strips into its arrays.
    { constructor()
    { super( "positions", "normals", "texture_coords" );
        for( var i = 0; i < 3; i++ )
            for( var j = 0; j < 2; j++ )
            { var square_transform = Mat4.rotation( i === 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) )
                .times( Mat4.rotation( Math.PI * j - ( i === 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                .times( Mat4.translation([ 0, 0, 1 ]) );
                Square.insert_transformed_copy_into( this, [], square_transform );
            }
    }
    };
