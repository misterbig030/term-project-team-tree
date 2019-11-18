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

window.Row_Grass = window.classes.Row_Grass =
    class Row_Grass extends Shape                                   // An axis set with arrows, made out of a lot of various primitives.
    { constructor(rows, columns, x_lower_bound, x_upper_bound, z_lower_bound, z_upper_bound, gap=1)
    { super( "positions", "normals", "texture_coords" );
        this.draw_row_grass();
        this.draw_row_grass(rows, columns, x_lower_bound, x_upper_bound, z_lower_bound, z_upper_bound, gap)
    }
        draw_row_grass(rows, columns, x_lower_bound, x_upper_bound, z_lower_bound, z_upper_bound, gap)
        {
            let shear_mat;
            let offset;
            for (let i = x_lower_bound; i< x_upper_bound; i+=gap){
                shear_mat = Mat.of(
                    [1, 0.1 * Math.cos(Math.PI * i) + 0.3, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                );
                Grass.insert_transformed_copy_into( this, [rows, columns ],Mat4.translation([ i + Math.random(), 0, 0])
                    .times(Mat4.rotation((Math.random()-0.5) * Math.PI, Vec.of(0,1,0)))
                    .times(shear_mat));
            }

        }
    };

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
