window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
class Assignment_Three_Scene extends Scene_Component {
    constructor(context, control_box)     // The scene begins by requesting the camera, shapes, and materials it will need.
    {
        super(context, control_box);    // First, include a secondary Scene that provides movement controls:
        if (!context.globals.has_controls)
            context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

        //context.globals.graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 20, 40), Vec.of(0, 10, -10), Vec.of(0, 1, 0))
        context.globals.graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 20, 40), Vec.of(0, 8, -10), Vec.of(0, 1, 0));
        this.initial_camera_location = Mat4.inverse(context.globals.graphics_state.camera_transform);

        const r = context.width / context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

        const z_lower_bound = this.z_lower_bound = -80, z_upper_bound = this.z_upper_bound = 20;
        const y_lower_bound = this.y_lower_bound = -200, y_upper_bound = this.y_upper_bound = 0;
        const x_lower_bound = this.x_lower_bound = -100, x_upper_bound = this.x_upper_bound = 100;
        const grass_gap = this.grass_gap = 1;

        const cylinder_r = this.cylinder_r = 1;
        const cylinder_h = this.cylinder_h = 4;
        const xz_speed = this.xz_speed = 0.20;
        const y_speed = this.y_speed = 1;
        const decay = this.decay = 0.7;     //decay defines how fast the branchs gets smaller.
                                            //For blended cylinders, top radius = 0.8 bottom radius;
        let random_array = this.random_array = [];
        for (let i=0; i<10; i++){
            random_array.push(Math.random());
        }
        console.log(random_array);


        const shapes = {
            ground: new Cube(),
            grass: new Grass(5, 10),
            row_grass: new Row_Grass(5, 10, this.x_lower_bound, this.x_upper_bound, this.z_lower_bound, this.z_upper_bound, this.grass_gap),
            apple: new Apple(10, 10),
            apple_2: new Subdivision_Sphere(4),
            cylinder: new Cylinder(15, 15),
            main_trunk: new Pratical_Cylinder(cylinder_r, cylinder_h),
            fakecube: new Fake_Cube(),
            grass1: new Grass1(5, 10),
//        cone: new Pratical_Cone(cylinder_r, cylinder_h),
        }
        shapes.apple_2.texture_coords = shapes.apple_2.texture_coords.map(v => Vec.of(v[0] * 1, v[1] * 1));
        shapes.apple.texture_coords = shapes.apple.texture_coords.map(v => Vec.of(v[0] * 0.1, v[1] * 0.1));
        //for (let i=0; i<shapes.cylinder.positions.length; i++){
        //  shapes.cylinder.positions[i][0] += shapes.cylinder.positions[i][1]**2;
        //}

        this.submit_shapes(context, shapes);

        // Make some Material objects available to you:
        this.materials =
            {
                main_trunk: context.get_instance(Phong_Shader_Cylinder).material(
                    Color.of(0, 0, 0, 1), {
                        ambient: 0.5,
                        texture: context.get_instance("assets/wood_2.jpg"),
                        xz_t: 0,
                        y_t: 0,
                        cylinder_r: cylinder_r,
                        cylinder_h: cylinder_h,
                        xz_speed: xz_speed,
                        y_speed: y_speed,
                        diffusivity: 0.5,
                        specularity: 0.5,
                    }
                ),

                branch: context.get_instance(Phong_Shader_Cylinder_Blended).material(
                    Color.of(0, 0, 0, 1), {
                        ambient: 0.5,
                        texture: context.get_instance("assets/wood_2.jpg"),
                        xz_t: 0,
                        y_t: 0,
                        cylinder_r: cylinder_r,
                        cylinder_h: cylinder_h,
                        xz_speed: xz_speed,
                        y_speed: y_speed,
                        diffusivity: 0.5,
                        specularity: 0.5,
                        //blending coeficients:
                        //  x += a * pow(y, b)
                        a: 0,
                        b: 1,
                        c: 1,

                        decay: this.decay,
                        r_percentage: 1,
                    }
                ),
                apple: context.get_instance(Apple_Shader).material(
                    Color.of(0, 0, 0, 1), {
                        ambient: 1,
                        texture: context.get_instance("assets/apple-texture.jpg"),
                    }
                ),
                ground: context.get_instance(Phong_Shader).material(Color.of(153 / 255, 76 / 255, 0, 1), {ambient: 0.4}),
                grass1: context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), {ambient: 0.5, texture: context.get_instance("assets/leave3.jpg",true)}),
                grass: context.get_instance(Phong_Shader).material(Color.of(0, 1, 0, 1), {ambient: 0.5}),
                trunk: context.get_instance(Phong_Shader).material(Color.of(102 / 255, 51 / 255, 0, 1), {ambient: .5}),

            }

        this.lights = [new Light(Vec.of(0, 10, 5, 1), Color.of(0, 1, 1, 1), 1000)];
        this.tree_pause = false;
        this.tree_xz_t = 0;
        this.tree_y_t = 0;
        this.tree_xz_t = 1000;
        this.tree_y_t = 1000;
    }

    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
    {
        //this.key_triggered_button("View solar system", ["0"], () => this.attached = () => this.initial_camera_location);
        this.key_triggered_button("tree pause/resume", ["1"], () => this.tree_pause = !this.tree_pause);
        this.key_triggered_button("tree start reset", ["2"], () => {
            this.tree_xz_t = 0;
            this.tree_y_t = 0;
            this.tree_pause = false;
        });
    };


    display(graphics_state) {
        graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
        //cylinder


        let trunk_shear = Mat.of(
            [1, 0.1, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        );
        let trunk_matrix = Mat4.identity();
        trunk_matrix = trunk_matrix.times(Mat4.translation([0, 0, -20]));
        if (t > 0 && t < 5) {
            trunk_matrix = trunk_matrix.times(trunk_shear);
            trunk_matrix = trunk_matrix.times(Mat4.scale([1, t, 1]));
//      this.shapes.cylinder.draw(graphics_state, trunk_matrix, this.materials.trunk);
        } else {
            trunk_matrix = trunk_matrix.times(trunk_shear);
            trunk_matrix = trunk_matrix.times(Mat4.scale([1, 5, 1]));
//      this.shapes.cylinder.draw(graphics_state, trunk_matrix, this.materials.trunk);
        }


        let ground_transform = Mat4.identity();
        ground_transform = ground_transform.times(Mat4.translation(Vec.of((this.x_upper_bound + this.x_lower_bound) / 2,
            (this.y_upper_bound + this.y_lower_bound) / 2, (this.z_upper_bound + this.z_lower_bound) / 2)));
        ground_transform = ground_transform.times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)));
        ground_transform = ground_transform.times(Mat4.scale([(this.x_upper_bound - this.x_lower_bound) / 2,
            (this.z_upper_bound - this.z_lower_bound) / 2, (this.y_upper_bound - this.y_lower_bound) / 2]));
        this.shapes.ground.draw(graphics_state, ground_transform, this.materials.ground);

        //apple
        let model_transform = Mat4.identity();
        model_transform = model_transform.times(Mat4.translation([0, 3, -10]));
        model_transform = model_transform.times(Mat4.rotation(t, Vec.of(1, 0, 0)));
        model_transform = model_transform.times(Mat4.scale([4, 4, 4]));
//    this.shapes.apple.draw(graphics_state, model_transform, this.materials.apple);

        //grass
        let shear_mat = Mat.of(
            [1, 0.1 * Math.cos(Math.PI * t) + 0.2, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        );
        let grass_transform = Mat4.identity();
        let offset;
        for (let i = this.z_lower_bound; i < this.z_upper_bound; i += this.grass_gap) {
            offset = Math.cos(i) ** 2;
            grass_transform = grass_transform.times(Mat4.translation([offset, 0, i + offset]));
            grass_transform = grass_transform.times(shear_mat);
            //this.shapes.row_grass.draw(graphics_state, grass_transform, this.materials.grass);
            grass_transform = Mat4.identity();
        }


        //testing pratical system:
        if (!this.tree_pause) {
            this.tree_xz_t += dt;
            this.tree_y_t += dt;
        }
        //root
        model_transform = Mat4.identity();
        model_transform = model_transform.times(Mat4.translation([0,3,-10]));
        model_transform = model_transform.times(Mat4.rotation(Math.PI/5, Vec.of(0,1,0)));
        //this.shapes.main_trunk.draw(graphics_state, model_transform, this.materials.branch
            //.override({xz_t: this.tree_xz_t, y_t: this.tree_y_t, a:0.25, b:2, c:-1}));
        model_transform = model_transform.times(Mat4.translation([0,-0.5,0]));
        model_transform = model_transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        //this.shapes.main_trunk.draw(graphics_state, model_transform, this.materials.branch
            //.override({xz_t: this.tree_xz_t, y_t: this.tree_y_t, a:0.25, b:2, c:-1}));
        model_transform = model_transform.times(Mat4.translation([0,-0.5,0]));
        model_transform = model_transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        //this.shapes.main_trunk.draw(graphics_state, model_transform, this.materials.branch
            //.override({xz_t: this.tree_xz_t, y_t: this.tree_y_t, a:0.25, b:2, c:-1}));
        model_transform = model_transform.times(Mat4.translation([0,-0.5,0]));
        model_transform = model_transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        //this.shapes.main_trunk.draw(graphics_state, model_transform, this.materials.branch
            //.override({xz_t: this.tree_xz_t, y_t: this.tree_y_t, a:0.25, b:2, c:-1}));

        //main_trunk
        //this.shapes.main_trunk.draw(graphics_state, Mat4.translation([0, 0, -10]), this.materials.main_trunk
            //.override({xz_t: this.tree_xz_t, y_t: this.tree_y_t}));
        //this.shapes.main_trunk.draw(graphics_state, Mat4.translation([0, this.cylinder_h, -10]), this.materials.main_trunk
            //.override({xz_t: this.tree_xz_t, y_t: this.tree_y_t - this.cylinder_h / this.y_speed}));


        let start_y = 8;
        this.recursive_draw(graphics_state, 0, start_y, this.tree_xz_t, this.tree_y_t - start_y / this.y_speed,
            0.25, 2, 1, Mat4.translation([0,start_y,0]));
        this.recursive_draw(graphics_state, 0, start_y, this.tree_xz_t, this.tree_y_t - start_y / this.y_speed,
            0.5, 1.2, 1, Mat4.translation([0,start_y,0]));
        this.recursive_draw(graphics_state, 0, start_y, this.tree_xz_t, this.tree_y_t - start_y / this.y_speed,
            1, 1, 1, Mat4.translation([0,start_y,0]));
    }
    recursive_draw(graphics_state, start_x, start_y, xz_t, y_t, a, b, c, mt = Mat4.identity(), r_percentage = 1, pre_offset = 1){
        //let noise = this.random_array[Math.floor((start_x + 1) * start_y * a * b * c) % 10] ** 2;
        let noise = Math.cos((start_x + 1) * start_y * a * b * c)** 2;
        //let noise = 1;
        let random_rotation = Mat4.rotation(noise * Math.PI * 2, Vec.of(0,1,0));
        let world_translation= Mat4.translation([0,0,-10]);

        let model_transform = world_translation.times(mt).times(random_rotation);
        this.shapes.main_trunk.draw(graphics_state, model_transform, this.materials.branch.override({
                xz_t: xz_t,
                y_t: y_t,
                a:a,
                b:b,
                c:c,
                r_percentage:r_percentage,
            }));
        //.override({xz_t: xz_t, y_t: y_t, a:1.4, b:1/1.4, c:1}));
        //calculate end point:
        //  x += a * pow(y, b)
        if (r_percentage > 0.10) {
            for (let offset of [0.6, 0.98]) {
                let end_x = a * Math.pow(this.cylinder_h * offset, b);
                let end_y = this.cylinder_h * c * offset;
                let pass_out_mt = mt.times(random_rotation).times(Mat4.translation([end_x, end_y, 0]));
                let new_c = c * 0.8;
                let new_y_t = (1 + noise) * (y_t - this.cylinder_h * offset / this.y_speed);
                if (r_percentage < 0.2 && new_c > 0){
                    new_c = -new_c;
                }
                this.recursive_draw(graphics_state, end_x, end_y, (1 + noise) * xz_t, new_y_t,
                    1.00 * a, 1.5 / b, new_c, pass_out_mt, r_percentage * this.decay, offset);
            }
        }
        if (r_percentage < 0.20){
            for (let offset of [0.6, 0.98]) {
                let end_x = a * Math.pow(this.cylinder_h * offset, b);
                let end_y = this.cylinder_h * c * offset;
                let pass_out_mt = mt.times(random_rotation).times(Mat4.translation([end_x, end_y, 0]));
                model_transform = world_translation.times(pass_out_mt);
                let apple_t = 0;
                let new_y_t = (y_t - this.cylinder_h * offset / this.y_speed);
                if (new_y_t > 0){
                    apple_t = 0.1 * new_y_t;
                }
                if (apple_t > 1){
                    apple_t = 1;
                }
                console.log(apple_t);
                model_transform = model_transform.times(Mat4.scale([apple_t, apple_t, apple_t])).times(Mat4.translation([0,-2,0])).times(Mat4.scale([1,1,0.3]));;
                this.shapes.grass1.draw(graphics_state, model_transform, this.materials.grass1);
            }
        }
    }
}



