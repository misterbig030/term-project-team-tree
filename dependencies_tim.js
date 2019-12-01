window.Hair_stream = window.classes.Hair_stream =
class Hair_stream extends Shape
{
    constructor(n, angle)
    {
        super( "positions", "normals", "texture_coords" );
        var da = angle / n;

        for(var i = 0; i < n; i++)
        {
            var pt = Vec.of(Math.sin(i*da), Math.cos(i*da), 0);
            this.positions.push(pt);
            this.normals.push(Vec.of(0,0,1));
            this.texture_coords.push(Vec.of(0,1 - i*da/angle));

            var rot_pt = Mat4.rotation(Math.PI/10, Vec.of(0,1,0)).times( pt.to4(1) ).to3();
            this.positions.push(rot_pt);
            this.normals.push(Vec.of(0,0,1));
            this.texture_coords.push(Vec.of(1,1 - i*da/angle));

            if(i != 0)
                this.indices.push(2*i - 2, 2*i + 1, 2*i - 1, 2*i - 2, 2*i, 2*i + 1);
        }
    }
}

window.Hair_string = window.classes.Hair_string =
class Hair_string extends Shape
{
    constructor(n, angle)
    {
        super( "positions", "normals", "texture_coords" );
        var da = angle / n;
        
        
        for(var i = 0; i < n; i++)
        {
            this.positions.push(Vec.of(Math.sin(i*da), Math.cos(i*da), 0));
            this.normals.push(Vec.of(0,0,1));

            var thickness = Math.sin(i*da*20)*0.05 + 0.05;

            this.positions.push(Vec.of(Math.sin(i*da) * (1 + thickness), Math.cos(i*da) * (1 + thickness), 0));
            this.normals.push(Vec.of(0,0,1));

            if(i != 0)
                this.indices.push(2*i - 2, 2*i + 1, 2*i - 1, 2*i - 2, 2*i, 2*i + 1);
        }
    }
}

window.Hair_t = window.classes.Hair_t =
class Hair_t extends Shape
{
    constructor()
    {
        super("positions", "normals", "texture_coords");
        let str = new Hair_stream(100, Math.PI);
        str.positions = str.positions.map(p => Mat4.rotation(-Math.PI/4, Vec.of(0,1,0)).times( p.to4(1) ).to3());
        Surface_Of_Revolution_Y.insert_transformed_copy_into( this, [ 100, 15, str.positions, [ [ 0, 1 ], [ 0, 1 ] ], Math.PI*2 ] );
        // let str = new Hair_string(100, Math.PI*3/4);
        // str.positions = str.positions.map(p => Mat4.rotation(-Math.PI/4, Vec.of(0,1,0)).times( p.to4(1) ).to3());

        // Surface_Of_Revolution_Y.insert_transformed_copy_into( this, [ 100, 15, str.positions, [ [ 0, 100 ], [ 0, 15 ] ], Math.PI*3/2 ] );
    }
}


window.Surface_Of_Revolution_X = window.classes.Surface_Of_Revolution_X =
    class Surface_Of_Revolution_X extends Grid_Patch      // SURFACE OF REVOLUTION: Produce a curved "sheet" of triangles with rows and columns.
      // Begin with an input array of points, defining a 1D path curving through 3D space --
      // now let each such point be a row.  Sweep that whole curve around the Z axis in equal
      // steps, stopping and storing new points along the way; let each step be a column. Now
      // we have a flexible "generalized cylinder" spanning an area until total_curvature_angle.
    { constructor( rows, columns, points, texture_coord_range, total_curvature_angle = 2*Math.PI )
    { const row_operation =     i => Grid_Patch.sample_array( points, i ),
        column_operation = (j,p) => Mat4.rotation( total_curvature_angle/columns, Vec.of( 1,0,0 ) ).times(p.to4(1)).to3();

      super( rows, columns, row_operation, column_operation, texture_coord_range );
    }
    }

window.Cone = window.classes.Cone =
class Cone extends Shape
{                                       
    constructor( max_subdivisions )       // unit sphere) and group them into triangles by following the predictable pattern of the recursion.
    { super( "positions", "normals", "texture_coords" );                      // Start from the following equilateral tetrahedron:
        this.positions.push( ...Vec.cast( [ 0, 0, -1 ], [ 0, .9428, .3333 ], [ -.8165, -.4714, .3333 ], [ .8165, -.4714, .3333 ] ) );

        this.subdivideTriangle( 0, 1, 2, max_subdivisions);  // Begin recursion.
        this.subdivideTriangle( 3, 2, 1, max_subdivisions);
        this.subdivideTriangle( 1, 0, 3, max_subdivisions);
        this.subdivideTriangle( 0, 2, 3, max_subdivisions);

    for( let p of this.positions )
        { this.normals.push( p.copy() );                 // Each point has a normal vector that simply goes to the point from the origin.

                         // Textures are tricky.  A Subdivision sphere has no straight seams to which image
                         // edges in UV space can be mapped.  The only way to avoid artifacts is to smoothly
        this.texture_coords.push(                      // wrap & unwrap the image in reverse - displaying the texture twice on the sphere.
        Vec.of( Math.asin( p[0]/Math.PI)  + .5, Math.asin( p[1]/Math.PI)  + .5 ) ) }
    }

    subdivideTriangle( a, b, c, count )   // Recurse through each level of detail by splitting triangle (a,b,c) into four smaller ones.
    {
        if( count <= 0) { this.indices.push(a,b,c); return; }  // Base case of recursion - we've hit the finest level of detail we want.

        if(a == -1 || b == -1 || c == -1)
            return;

        var ab_vert = this.positions[a].mix( this.positions[b], 0.5).normalized(),     // We're not at the base case.  So, build 3 new
        ac_vert = this.positions[a].mix( this.positions[c], 0.5).normalized(),     // vertices at midpoints, and extrude them out to
        bc_vert = this.positions[b].mix( this.positions[c], 0.5).normalized();     // touch the unit sphere (length 1).

        var threshold = -1;

        if(ab_vert[2] > threshold)
            var ab = this.positions.push( ab_vert ) - 1;      
        else
            var ab = -1;
        if(ac_vert[2] > threshold)
            var ac = this.positions.push( ac_vert ) - 1;
        else
            var ac = -1;
        if(bc_vert[2] > threshold)
            var bc = this.positions.push( bc_vert ) - 1;
        else 
            var bc = -1;

        this.subdivideTriangle( a, ab, ac,  count - 1 );          // Recurse on four smaller triangles, and we're done.  Skipping every
        this.subdivideTriangle( ab, b, bc,  count - 1 );          // fourth vertex index in our list takes you down one level of detail,
        this.subdivideTriangle( ac, bc, c,  count - 1 );          // and so on, due to the way we're building it.
        this.subdivideTriangle( ab, bc, ac, count - 1 );
}
}
