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

window.Oblate_1 = window.classes.Oblate_1 =
    class Oblate_1 extends Shape
    {
        constructor( max_subdivisions )
        { super( "positions", "normals", "texture_coords" );                      // Start from the following equilateral tetrahedron:
            Subdivision_Sphere.insert_transformed_copy_into(this, [max_subdivisions], Mat4.scale([1.3,0.4,1]));
        }

    };
window.Oblate_2 = window.classes.Oblate_2 =
    class Oblate_2 extends Shape
    {
        constructor( max_subdivisions )
        { super( "positions", "normals", "texture_coords" );                      // Start from the following equilateral tetrahedron:
            Subdivision_Sphere.insert_transformed_copy_into(this, [max_subdivisions], Mat4.scale([1.05,0.3,0.8]));
        }

    };

window.Oblate_3 = window.classes.Oblate_3 =
    class Oblate_3 extends Shape
    {
        constructor( max_subdivisions )
        { super( "positions", "normals", "texture_coords" );                      // Start from the following equilateral tetrahedron:
            Subdivision_Sphere.insert_transformed_copy_into(this, [max_subdivisions], Mat4.scale([0.85,0.3,0.6]));
        }

    };
window.Oblate_4 = window.classes.Oblate_4 =
    class Oblate_4 extends Shape
    {
        constructor( max_subdivisions )
        { super( "positions", "normals", "texture_coords" );                      // Start from the following equilateral tetrahedron:
            Subdivision_Sphere.insert_transformed_copy_into(this, [max_subdivisions], Mat4.scale([0.62,0.3,0.4]));
        }

    };

window.Oblate_5 = window.classes.Oblate_5 =
    class Oblate_5 extends Shape
    {
        constructor( max_subdivisions )
        { super( "positions", "normals", "texture_coords" );                      // Start from the following equilateral tetrahedron:
            Subdivision_Sphere.insert_transformed_copy_into(this, [max_subdivisions], Mat4.scale([0.37,0.3,0.2]));
        }

    };




//poop
window.Poop = window.classes.Poop =
    class Poop extends Shape
    {
        constructor( max_subdivisions )
        { super( "positions", "normals", "texture_coords" );                      // Start from the following equilateral tetrahedron:
            Oblate_1.insert_transformed_copy_into(this, [max_subdivisions]);
            Oblate_2.insert_transformed_copy_into(this, [max_subdivisions], Mat4.translation([0,0.45,0]));
            Oblate_3.insert_transformed_copy_into(this, [max_subdivisions], Mat4.translation([0,0.8,0]));
            Oblate_4.insert_transformed_copy_into(this, [max_subdivisions], Mat4.translation([0,1.1,0]));
            Oblate_5.insert_transformed_copy_into(this, [max_subdivisions], Mat4.translation([0,1.3,0]));
        }

    };

// window.Poop_Shader = window.classes.Poop_Shader =
//     class Poop_Shader extends Shader          // THE DEFAULT SHADER: This uses the Phong Reflection Model, with optional Gouraud shading.
//                                                // Wikipedia has good defintions for these concepts.  Subclasses of class Shader each store
//                                                // and manage a complete GPU program.  This particular one is a big "master shader" meant to
//                                                // handle all sorts of lighting situations in a configurable way.
//                                                // Phong Shading is the act of determining brightness of pixels via vector math.  It compares
//                                                // the normal vector at that pixel to the vectors toward the camera and light sources.
//         // *** How Shaders Work:
//         // The "vertex_glsl_code" string below is code that is sent to the graphics card at runtime,
//         // where on each run it gets compiled and linked there.  Thereafter, all of your calls to draw
//         // shapes will launch the vertex shader program once per vertex in the shape (three times per
//         // triangle), sending results on to the next phase.  The purpose of this vertex shader program
//         // is to calculate the final resting place of vertices in screen coordinates; each vertex
//         // starts out in local object coordinates and then undergoes a matrix transform to get there.
//         //
//         // Likewise, the "fragment_glsl_code" string is used as the Fragment Shader program, which gets
//         // sent to the graphics card at runtime.  The fragment shader runs once all the vertices in a
//         // triangle / element finish their vertex shader programs, and thus have finished finding out
//         // where they land on the screen.  The fragment shader fills in (shades) every pixel (fragment)
//         // overlapping where the triangle landed.  It retrieves different values (such as vectors) that
//         // are stored at three extreme points of the triangle, and then interpolates the values weighted
//         // by the pixel's proximity to each extreme point, using them in formulas to determine color.
//         // The fragment colors may or may not become final pixel colors; there could already be other
//         // triangles' fragments occupying the same pixels.  The Z-Buffer test is applied to see if the
//         // new triangle is closer to the camera, and even if so, blending settings may interpolate some
//         // of the old color into the result.  Finally, an image is displayed onscreen.
//     { material( color, properties )     // Define an internal class "Material" that stores the standard settings found in Phong lighting.
//     { return new class Material       // Possible properties: ambient, diffusivity, specularity, smoothness, gouraud, texture.
//     { constructor( shader, color = Color.of( 0,0,0,1 ), ambient = 0, diffusivity = 1, specularity = 1, smoothness = 40 )
//     { Object.assign( this, { shader, color, ambient, diffusivity, specularity, smoothness } );  // Assign defaults.
//         Object.assign( this, properties );                                                        // Optionally override defaults.
//     }
//         override( properties )                      // Easily make temporary overridden versions of a base material, such as
//         { const copied = new this.constructor();  // of a different color or diffusivity.  Use "opacity" to override only that.
//             Object.assign( copied, this );
//             Object.assign( copied, properties );
//             copied.color = copied.color.copy();
//             if( properties[ "opacity" ] != undefined ) copied.color[3] = properties[ "opacity" ];
//             return copied;
//         }
//     }( this, color );
//     }
//         map_attribute_name_to_buffer_name( name )                  // We'll pull single entries out per vertex by field name.  Map
//         {                                                        // those names onto the vertex array names we'll pull them from.
//             return { object_space_pos: "positions", normal: "normals", tex_coord: "texture_coords" }[ name ]; }   // Use a simple lookup table.
//         shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
//         { return `precision mediump float;
//         const int N_LIGHTS = 2;             // We're limited to only so many inputs in hardware.  Lights are costly (lots of sub-values).
//         uniform float ambient, diffusivity, specularity, smoothness, animation_time, attenuation_factor[N_LIGHTS];
//         uniform bool GOURAUD, COLOR_NORMALS, USE_TEXTURE;               // Flags for alternate shading methods
//         uniform vec4 lightPosition[N_LIGHTS], lightColor[N_LIGHTS], shapeColor;
//         varying vec3 N, E;                    // Specifier "varying" means a variable's final value will be passed from the vertex shader
//         varying vec2 f_tex_coord;             // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
//         varying vec4 VERTEX_COLOR;            // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
//         varying vec3 L[N_LIGHTS], H[N_LIGHTS];
//         varying float dist[N_LIGHTS];
//         varying vec3 position;
//
//         vec3 phong_model_lights( vec3 N )
//           { vec3 result = vec3(0.0);
//             for(int i = 0; i < N_LIGHTS; i++)
//               {
//                 float attenuation_multiplier = 1.0 / (1.0 + attenuation_factor[i] * (dist[i] * dist[i]));
//                 float diffuse  =      max( dot(N, L[i]), 0.0 );
//                 float specular = pow( max( dot(N, H[i]), 0.0 ), smoothness );
//
//                 result += attenuation_multiplier * ( shapeColor.xyz * diffusivity * diffuse + lightColor[i].xyz * specularity * specular );
//               }
//             return result;
//           }
//         `;
//         }
//         vertex_glsl_code()           // ********* VERTEX SHADER *********
//         { return `
//         attribute vec3 object_space_pos, normal;
//         attribute vec2 tex_coord;
//
//         uniform mat4 camera_transform, camera_model_transform, projection_camera_model_transform;
//         uniform mat3 inverse_transpose_modelview;
//
//         void main()
//         {
//           position = object_space_pos;
//           gl_Position = projection_camera_model_transform * vec4(object_space_pos, 1.0);     // The vertex's final resting place (in NDCS).
//           N = normalize( inverse_transpose_modelview * normal );                             // The final normal vector in screen space.
//           f_tex_coord = tex_coord;                                         // Directly use original texture coords and interpolate between.
//
//           if( COLOR_NORMALS )                                     // Bypass all lighting code if we're lighting up vertices some other way.
//           { VERTEX_COLOR = vec4( N[0] > 0.0 ? N[0] : sin( animation_time * 3.0   ) * -N[0],             // In "normals" mode,
//                                  N[1] > 0.0 ? N[1] : sin( animation_time * 15.0  ) * -N[1],             // rgb color = xyz quantity.
//                                  N[2] > 0.0 ? N[2] : sin( animation_time * 45.0  ) * -N[2] , 1.0 );     // Flash if it's negative.
//             return;
//           }
//                                                   // The rest of this shader calculates some quantities that the Fragment shader will need:
//           vec3 screen_space_pos = ( camera_model_transform * vec4(object_space_pos, 1.0) ).xyz;
//           E = normalize( -screen_space_pos );
//
//           for( int i = 0; i < N_LIGHTS; i++ )
//           {            // Light positions use homogeneous coords.  Use w = 0 for a directional light source -- a vector instead of a point.
//             L[i] = normalize( ( camera_transform * lightPosition[i] ).xyz - lightPosition[i].w * screen_space_pos );
//             H[i] = normalize( L[i] + E );
//
//             // Is it a point light source?  Calculate the distance to it from the object.  Otherwise use some arbitrary distance.
//             dist[i]  = lightPosition[i].w > 0.0 ? distance((camera_transform * lightPosition[i]).xyz, screen_space_pos)
//                                                 : distance( attenuation_factor[i] * -lightPosition[i].xyz, object_space_pos.xyz );
//           }
//
//           if( GOURAUD )                   // Gouraud shading mode?  If so, finalize the whole color calculation here in the vertex shader,
//           {                               // one per vertex, before we even break it down to pixels in the fragment shader.   As opposed
//                                           // to Smooth "Phong" Shading, where we *do* wait to calculate final color until the next shader.
//             VERTEX_COLOR      = vec4( shapeColor.xyz * ambient, shapeColor.w);
//             VERTEX_COLOR.xyz += phong_model_lights( N );
//           }
//         }`;
//         }
//         fragment_glsl_code()           // ********* FRAGMENT SHADER *********
//         {                            // A fragment is a pixel that's overlapped by the current triangle.
//             // Fragments affect the final image or get discarded due to depth.
//             return `
//         uniform sampler2D texture;
//         void main()
//         { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
//           { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.
//             return;
//           }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
//                                             // Phong shading is not to be confused with the Phong Reflection Model.
//           float tex_x, tex_y;
//           if(position.x >= -0.2 && position.x <= 0.2)
//           {
//             if(position.y >= 0.0 && position.y <= 0.4)
//             {
//                 tex_x = (position.x + 0.2)/ 0.4;
//                 tex_y = position.y / 0.4;
//                 vec4 tex_color = texture2D( texture, vec2(tex_x, tex_y));
//                 gl_FragColor = vec4( ( tex_color.xyz) * ambient, tex_color.w );
//                 gl_FragColor.xyz += phong_model_lights( N );
//                 return;
//             }
//           }
//           //vec4 tex_color = texture2D( texture, vec2(tex_x, tex_y));                         // Sample the texture image in the correct place.
//                                                                                       // Compute an initial (ambient) color:
//           //if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w );
//           gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
//           gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
//         }`;
//         }
//         // Define how to synchronize our JavaScript's variables to the GPU's:
//         update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
//         {                              // First, send the matrices to the GPU, additionally cache-ing some products of them we know we'll need:
//             this.update_matrices( g_state, model_transform, gpu, gl );
//             gl.uniform1f ( gpu.animation_time_loc, g_state.animation_time / 1000 );
//
//             if( g_state.gouraud === undefined ) { g_state.gouraud = g_state.color_normals = false; }    // Keep the flags seen by the shader
//             gl.uniform1i( gpu.GOURAUD_loc,        g_state.gouraud || material.gouraud );                // program up-to-date and make sure
//             gl.uniform1i( gpu.COLOR_NORMALS_loc,  g_state.color_normals );                              // they are declared.
//
//             gl.uniform4fv( gpu.shapeColor_loc,     material.color       );    // Send the desired shape-wide material qualities
//             gl.uniform1f ( gpu.ambient_loc,        material.ambient     );    // to the graphics card, where they will tweak the
//             gl.uniform1f ( gpu.diffusivity_loc,    material.diffusivity );    // Phong lighting formula.
//             gl.uniform1f ( gpu.specularity_loc,    material.specularity );
//             gl.uniform1f ( gpu.smoothness_loc,     material.smoothness  );
//
//             if( material.texture )                           // NOTE: To signal not to draw a texture, omit the texture parameter from Materials.
//             { gpu.shader_attributes["tex_coord"].enabled = true;
//                 gl.uniform1f ( gpu.USE_TEXTURE_loc, 1 );
//                 gl.bindTexture( gl.TEXTURE_2D, material.texture.id );
//             }
//             else  { gl.uniform1f ( gpu.USE_TEXTURE_loc, 0 );   gpu.shader_attributes["tex_coord"].enabled = false; }
//
//             if( !g_state.lights.length )  return;
//             var lightPositions_flattened = [], lightColors_flattened = [], lightAttenuations_flattened = [];
//             for( var i = 0; i < 4 * g_state.lights.length; i++ )
//             { lightPositions_flattened                  .push( g_state.lights[ Math.floor(i/4) ].position[i%4] );
//                 lightColors_flattened                     .push( g_state.lights[ Math.floor(i/4) ].color[i%4] );
//                 lightAttenuations_flattened[ Math.floor(i/4) ] = g_state.lights[ Math.floor(i/4) ].attenuation;
//             }
//             gl.uniform4fv( gpu.lightPosition_loc,       lightPositions_flattened );
//             gl.uniform4fv( gpu.lightColor_loc,          lightColors_flattened );
//             gl.uniform1fv( gpu.attenuation_factor_loc,  lightAttenuations_flattened );
//         }
//         update_matrices( g_state, model_transform, gpu, gl )                                    // Helper function for sending matrices to GPU.
//         {                                                   // (PCM will mean Projection * Camera * Model)
//             let [ P, C, M ]    = [ g_state.projection_transform, g_state.camera_transform, model_transform ],
//                 CM     =      C.times(  M ),
//                 PCM    =      P.times( CM ),
//                 inv_CM = Mat4.inverse( CM ).sub_block([0,0], [3,3]);
//             // Send the current matrices to the shader.  Go ahead and pre-compute
//             // the products we'll need of the of the three special matrices and just
//             // cache and send those.  They will be the same throughout this draw
//             // call, and thus across each instance of the vertex shader.
//             // Transpose them since the GPU expects matrices as column-major arrays.
//             gl.uniformMatrix4fv( gpu.camera_transform_loc,                  false, Mat.flatten_2D_to_1D(     C .transposed() ) );
//             gl.uniformMatrix4fv( gpu.camera_model_transform_loc,            false, Mat.flatten_2D_to_1D(     CM.transposed() ) );
//             gl.uniformMatrix4fv( gpu.projection_camera_model_transform_loc, false, Mat.flatten_2D_to_1D(    PCM.transposed() ) );
//             gl.uniformMatrix3fv( gpu.inverse_transpose_modelview_loc,       false, Mat.flatten_2D_to_1D( inv_CM              ) );
//         }
//     }
