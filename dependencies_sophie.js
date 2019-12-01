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
        Grass.insert_transformed_copy_into(this, [ rows, columns]);
        for (let i=0; i<this.positions.length; i++){
            this.positions[i][0] += (this.positions[i][1]**2)*(-0.3);
        }
    } };

window.Grass_2 = window.classes.Grass_2 =
    class Grass_2 extends Shape
    { constructor( rows, columns )
    { super( "positions", "normals", "texture_coords" );
        Grass.insert_transformed_copy_into(this, [ rows, columns]);
        for (let i=0; i<this.positions.length; i++){
            this.positions[i][1] = this.positions[i][1]*1.3;
            this.positions[i][0] += (this.positions[i][1]**2)*0.15;
        }
    } };

window.Grass_3 = window.classes.Grass_3 =
    class Grass_3 extends Shape
    { constructor( rows, columns )
    { super( "positions", "normals", "texture_coords" );
        Grass.insert_transformed_copy_into(this, [ rows, columns]);
        for (let i=0; i<this.positions.length; i++){

            this.positions[i][0] += (this.positions[i][1]**2)*0.3;

        }
    } };

window.Bunch_Grass = window.classes.Bunch_Grass =
    class Bunch_Grass extends Shape
    { constructor( rows, columns )
    { super( "positions", "normals", "texture_coords" );
        Grass_1.insert_transformed_copy_into( this, [ rows, columns] );
        Grass_2.insert_transformed_copy_into( this, [ rows, columns] );
        Grass_3.insert_transformed_copy_into( this, [ rows, columns] );
    } };

window.Field = window.classes.Field =
    class Row2 extends Shape
    { constructor(rows, columns,
                  fd_x_lower_bound = -5,
                  fd_x_upper_bound = 5,
                  fd_z_lower_bound = -2.5,
                  fd_z_upper_bound = 2.5,
                  gap=1)
    { super( "positions", "normals", "texture_coords" );
        this.draw_row_grass(rows, columns, fd_x_lower_bound, fd_x_upper_bound, fd_z_lower_bound, fd_z_upper_bound,  gap)
    }
        draw_row_grass(rows, columns, fd_x_lower_bound, fd_x_upper_bound, fd_z_lower_bound, fd_z_upper_bound, gap)
        {

            let min, max, random;
            for (let i = fd_x_lower_bound; i< fd_x_upper_bound; i+=gap){
                for(let j = fd_z_lower_bound; j < fd_z_upper_bound; j += gap)
                {
                    min=0.5;
                    max=1.6;
                    random = Math.random() * (+max - +min) + +min;
                    Bunch_Grass.insert_transformed_copy_into( this, [rows, columns ],Mat4.translation([ i + Math.random(), 0, j + Math.random()])
                        .times(Mat4.scale([random,random,random])));
                }

            }

        }

     };


