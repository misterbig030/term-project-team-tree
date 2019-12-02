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
        const y_speed = this.y_speed = 1.0;
        const decay = this.decay = 0.7;     //decay defines how fast the branchs gets smaller.
                                            //For blended cylinders, top radius = 0.8 bottom radius;
        let random_array = this.random_array = [];
        for (let i=0; i<10; i++){
            random_array.push(Math.random());
        }


        const shapes = {
            ground: new Cube(),
            grass: new Grass(5, 10),
            bunch_grass: new Bunch_Grass(5,10),
            row_grass: new Row_Grass(5, 10, this.x_lower_bound, this.x_upper_bound, this.z_lower_bound, this.z_upper_bound, this.grass_gap),
            field: new Field(5,10),
            apple: new Apple(10, 10),
            rain: new Subdivision_Sphere(4),
            cylinder: new Cylinder(4, 10),
            main_trunk: new Pratical_Cylinder(cylinder_r, cylinder_h),
            fakecube: new Fake_Cube(),
            leaf: new Leaf(8, 16),
            one_hair: new One_Hair(100,100,0.5,2),
            ball: new Subdivision_Sphere(4),
            'box'  : new Cube(),
            'tri'  : new Triangle(),
            grass1: new Grass1(5, 10),
            //oblate_1: new Oblate_1(4)
            poop: new Poop(4),
            cloud : new Subdivision_Sphere( 4 ),

            cone: new Cone(4),
            head: new Subdivision_Sphere(4),
            hair: new Hair(40,50),
            body: new Cylinder(15,15),
            foot: new Cube(),
            years: new Square(),
            square: new Square(),
        }
        shapes.apple.texture_coords = shapes.apple.texture_coords.map(v => Vec.of(v[0] * 0.1, v[1] * 0.1));
        shapes.ground.texture_coords = shapes.ground.texture_coords.map(v => Vec.of(v[0] * 1, v[1] * 1));
        //shapes.poop.texture_coords = shapes.ground.texture_coords.map(v => Vec.of(v[0] * 1, v[1] * 1));

        this.submit_shapes(context, shapes);

        // Make some Material objects available to you:
        this.clay    = context.get_instance( Phong_Shader ).material( Color.of( .9,.5,.9, 1 ), { ambient:0.8, diffusivity:0 } );
        this.plastic = this.clay.override({ specularity:0 });
        this.rain_color = Color.of(0.8,1,0.8,0.1);
        this.materials =
            {
                rain: context.get_instance(Phong_Shader).material(this.rain_color, {ambient:0.7, diffusivity:1}),
                wood: context.get_instance(Phong_Shader).material(Color.of(153 / 255, 76 / 255, 0, 1), {ambient: 0.4}),
                fma_1: context.get_instance(Phong_Shader).material(
                    Color.of(0,0,0,1),{
                        ambient:1,
                        texture: context.get_instance("assets/fma_1.jpg"),
                    }
                ),
                fma_2: context.get_instance(Phong_Shader).material(
                    Color.of(0,0,0,1),{
                        ambient:1,
                        texture: context.get_instance("assets/fma_2.jpg"),
                    }
                ),
                fma_3: context.get_instance(Phong_Shader).material(
                    Color.of(0,0,0,1),{
                        ambient:1,
                        texture: context.get_instance("assets/fma_3.jpg"),
                    }
                ),
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
                ground: context.get_instance(Phong_Shader).material(
                    Color.of(0, 0, 0, 1), {
                        ambient: 1,
                        texture: context.get_instance("assets/ground.png"),
                    }
                ),
                grass1: context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), {ambient: 0.5, texture: context.get_instance("assets/leave3.jpg",true)}),
                grass: context.get_instance(Phong_Shader).material(Color.of(0, 1, 0, 1), {ambient: 0.5}),
                bunch_grass: context.get_instance(Phong_Shader).material(Color.of(0, 1, 0, 1), {ambient: 0.5}),
                trunk: context.get_instance(Phong_Shader).material(Color.of(102 / 255, 51 / 255, 0, 1), {ambient: .5}),
                poop: context.get_instance(Phong_Shader).material(Color.of(102 / 255, 51 / 255, 0, 1), {ambient: .5}),
                // poop: context.get_instance(Poop_Shader).material(
                //     Color.of(102 / 255, 51 / 255, 0, 1), {
                //         ambient: 0.5,
                //         texture: context.get_instance("assets/poop.jpg")
                //     }
                // ),
                cloud: context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), {ambient: 0.8, texture: context.get_instance("assets/cloud.jpeg",true)}),
                head: context.get_instance(Phong_Shader).material(
                    Color.of(0,0,0,1),{
                        ambient: 1,
                        texture: context.get_instance("assets/nt3.png"),
                    }),
                hair: context.get_instance(Phong_Shader).material(
                    Color.of(0,0,0,1), {
                        ambient: 1,
                        texture: context.get_instance("assets/nt4.jpg"),
                    }),
                white_hair: context.get_instance(Phong_Shader).material(
                    Color.of(1, 1, 1, 1), {
                        ambient: 0.2,
                    }),
                clothes: context.get_instance(Phong_Shader).material(
                    Color.of(0,0,0,1), {
                        ambient: 1,
                        texture: context.get_instance("assets/clothes2.jpg"),
                    }),
                years: context.get_instance(Phong_Shader).material(
                    Color.of(0,0,0,1), {
                        ambient: 1,
                        texture: context.get_instance("assets/2000.jpg"),
                    }),
            };

        this.lights = [new Light(Vec.of(0, 10, 5, 1), Color.of(0, 1, 1, 1), 1000)];
        this.tree_pause = true;
        this.tree_xz_t = 0;
        this.tree_y_t = 0;
        this.tree_xz_t = 0;
        this.tree_y_t = 0;
        this.bird_t = -5;
        this.bird_pause = true;
        this.current_camera = 0;
        this.camera_lock = false;
        this.camera_pos = [];
        this.camera_pos.push([Vec.of(0,20,40),Vec.of(0,8,-10), Vec.of(0,1,0)]);
        this.camera_pos.push([Vec.of(20,20,-10),Vec.of(0,8,-10), Vec.of(0,1,0)]);
        this.camera_pos.push([Vec.of(0,20,-40),Vec.of(0,8,-10), Vec.of(0,1,0)]);
        this.camera_pos.push([Vec.of(20,20,-10),Vec.of(0,8,-10), Vec.of(0,1,0)]);

        this.cloud_t = -5;
        this.cloud_pause = true;

        this.apple_t = -35;
        this.apple_pause = true;


        this.celebrate = false;
        this.cel_t = 0;

        this.rain_on = false;;
        this.rained = false;
        this.rain_t = -1;


        // var x = document.getElementById("BGM"); 
        // x.play(); 

        this.animation_t = 0;
        this.animation_pause = true;

        this.tmp_cloud_t = 0;
        this.poop_t = -5;

        this.newton_t = -30;
        this.newton_start = false;


        this.bird_audio = false;
        this.years_audio = false;

        this.apple_audio = false;
        this.tree_a = document.getElementById("tree_grow");

        this.woohoo = document.getElementById("woohoo");
        this.apple_fall_a = document.getElementById("appleFall");
        this.two_thousand_a = document.getElementById("sponge");
        this.rain_a = document.getElementById("rain_fall");
        this.bird = document.getElementById("bird");
    }

    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
    {
        //this.key_triggered_button("View solar system", ["0"], () => this.attached = () => this.initial_camera_location);
        //this.key_triggered_button("tree pause/resume", ["9"], () => this.tree_pause = !this.tree_pause);
        //this.key_triggered_button("tree start reset", ["9"], () => {
        //    this.tree_xz_t = 0;
        //    this.tree_y_t = 0;
        //    this.tree_pause = false;
        //});
        //this.key_triggered_button("bird pause/resume", ["9"], () => this.bird_pause = !this.bird_pause);
        //this.new_line();
        //this.key_triggered_button("bird reset", ["9"], () => {
        //    this.bird_pause = false;
        //    this.bird_t = -5;
        //});
        //this.key_triggered_button("rain reset", ['9'], () => {
        //    this.rain_on = true;
        //    this.rain_t = -1;
        //});
        //this.new_line();
        //for (let i=0; i<4; i++) {
        //    this.key_triggered_button("camera " + i.toString(10), [i.toString(10)], () => {
        //        if (this.current_camera == 0 && this.camera_lock) {
        //            this.camera_lock = false;
        //        } else {
        //            this.camera_lock = true;
        //        }
        //        this.current_camera = i;
        //        console.log(this.current_camera);
        //    })
        //}
        //this.new_line();
        //this.key_triggered_button("cloud pause/resume", ["9"], () => this.cloud_pause = !this.cloud_pause);
        //this.key_triggered_button("cloud reset", ["9"], () => {
        //    this.cloud_pause = false;
        //    this.cloud_t = -5;
        //});
        //this.key_triggered_button("apple pause/resume", ["9"], () => this.apple_pause = !this.apple_pause);
        //this.key_triggered_button("apple reset", ["9"], () => {
        //        this.cloud_pause = false;
        //        this.cloud_t = -5;
        //})
        //this.key_triggered_button("celebrate", ["9"], () => {
        //    this.celebrate = !this.celebrate;
        //    this.cel_t = 0;
        //});
        //this.new_line();
        this.key_triggered_button("animation reset", ["0"], () => {
            this.animation_t = 0;
            this.animation_pause = false;
            this.tree_pause = true;
            this.tree_xz_t = 0;
            this.tree_y_t = 0;
            this.tree_xz_t = 0;
            this.tree_y_t = 0;
            this.bird_t = -5;
            this.bird_pause = false;
            this.current_camera = 0;
            this.camera_lock = false;

            this.cloud_t = -5;
            this.cloud_pause = true;

            this.apple_t = -35;
            this.apple_pause = true;

            this.celebrate = false;
            this.cel_t = 0;

            this.rain_on = false;;
            this.rained = false;
            this.rain_t = -1;

            this.animation_t = 0;
            this.animation_pause = true;

            this.tmp_cloud_t = 0;
            this.newton_t = -5;
            this.newton_start = false;


            this.bird_audio = false;
            this.years_audio = false;

            this.apple_audio = false;
            this.tree_a.pause();
            this.woohoo.pause();
            this.apple_fall_a.pause();
            this.two_thousand_a.pause();
            this.rain_a.pause();
            this.bird.pause();
        });
        //this.key_triggered_button("animation pause/resume", ["p"], () => {
        //    this.animation_pause = !this.animation_pause;
        //    this.context.global.animate = 0;
        //});
    };

    draw_fma(graphics_state, t){
        let mt = Mat4.identity();
        mt = mt.times(Mat4.translation([-40,7,-30]));
        mt = mt.times(Mat4.scale([7,7,1]));
        this.shapes.square.draw(graphics_state, mt, this.materials.fma_1);

        mt = Mat4.translation([-26,7,-30]);
        mt = mt.times(Mat4.scale([7,7,1]));
        this.shapes.square.draw(graphics_state, mt, this.materials.fma_2);
        mt = Mat4.translation([-12,7,-30]);
        mt = mt.times(Mat4.scale([7,7,1]));
        this.shapes.square.draw(graphics_state, mt, this.materials.fma_3);
    }

    draw_newton(graphics_state, t, dt){
        //hair
        let hair_transform = Mat4.identity();

        if(this.celebrate){
            this.cel_t += dt;
            this.woohoo.play();
            hair_transform = hair_transform.times(Mat4.translation([0,0,this.cel_t*3]));
        }
        
        hair_transform = hair_transform.times(Mat4.translation([5,5.5,-10]));
        hair_transform = hair_transform.times(Mat4.scale([0.3,0.3,0.3]));
        hair_transform = hair_transform.times(Mat4.rotation(Math.PI/6, Vec.of(0,1,0)));
        
        
        this.shapes.hair.draw(graphics_state, hair_transform.times(Mat4.scale([5,8,5])), this.materials.hair);

        //head
        let head_transform = hair_transform.times(Mat4.translation([0,3,0])).times(Mat4.scale([5,5,5]));
        this.shapes.head.draw(graphics_state, head_transform, this.materials.hair);

        //face
        this.shapes.cone.draw(graphics_state, head_transform.times(Mat4.translation([0,0,0.01])), this.materials.head);

        //body
        let body_transform = head_transform.times(Mat4.translation([0,-4,0]));
        this.shapes.body.draw(graphics_state, body_transform.times(Mat4.scale([25,3,10])), this.materials.clothes);

        //hand
        let hand_transform = body_transform.times(Mat4.translation([-1.2,3,0]));

        if(this.celebrate){
            //hand_transform = hand_transform.times(Mat4.rotation(Math.sin(4*this.cel_t) * Math.PI/4, Vec.of(0,0,1)));
            hand_transform = hand_transform.times(Mat4.rotation(-Math.PI/2, Vec.of(0,0,1)));
        }

        hand_transform = hand_transform.times(Mat4.rotation(Math.PI*3/4, Vec.of(0,0,1)));
        hand_transform = hand_transform.times(Mat4.scale([5,2,5]));
        this.shapes.body.draw(graphics_state, hand_transform, this.materials.hair);

        hand_transform = body_transform.times(Mat4.translation([1.2,3,0]));

        if(this.celebrate){
            //hand_transform = hand_transform.times(Mat4.rotation(-Math.sin(4*this.cel_t) * Math.PI/4, Vec.of(0,0,1)));
            hand_transform = hand_transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,0,1)));
        }

        hand_transform = hand_transform.times(Mat4.rotation(-Math.PI*3/4, Vec.of(0,0,1)));
        hand_transform = hand_transform.times(Mat4.scale([5,2,5]));
        this.shapes.body.draw(graphics_state, hand_transform, this.materials.hair);


        //leg
        let left_leg_transform = body_transform.times(Mat4.translation([-0.7,0,0]));
        left_leg_transform = left_leg_transform.times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0)));

        if(this.celebrate){
            
            if(this.cel_t < Math.PI/2)
                left_leg_transform = left_leg_transform.times(Mat4.rotation(this.cel_t*2, Vec.of(0,0,1)));
            else
                left_leg_transform = left_leg_transform.times(Mat4.rotation(Math.PI, Vec.of(0,0,1)));
        }

        left_leg_transform = left_leg_transform.times(Mat4.scale([7,2.5,7]));
        this.shapes.body.draw(graphics_state, left_leg_transform, this.materials.hair);

        let right_leg_transform = body_transform.times(Mat4.translation([0.7,0,0]));
        right_leg_transform = right_leg_transform.times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0)));
        right_leg_transform = right_leg_transform.times(Mat4.scale([7,2.5,7]));
        this.shapes.body.draw(graphics_state, right_leg_transform, this.materials.hair);

        //foot
        let left_foot_transform = left_leg_transform;
        left_foot_transform = left_foot_transform.times(Mat4.scale([1/28, 1/10, 1.5/28]));
        left_foot_transform = left_foot_transform.times(Mat4.translation([0,11,-0.2]));
        this.shapes.foot.draw(graphics_state, left_foot_transform, this.materials.clothes);

        let right_foot_transform = right_leg_transform;
        right_foot_transform = right_foot_transform.times(Mat4.scale([1/28, 1/10, 1.5/28]));
        right_foot_transform = right_foot_transform.times(Mat4.translation([0,11,-0.2]));
        this.shapes.foot.draw(graphics_state, right_foot_transform, this.materials.clothes);
    }

    draw_one_rain(graphics_state, t, y_range, speed, mt, duration, time_offset){
        if (t<0){
            return;
        }
        //if (t > Math.floor(duration / (y_range / speed)) * y_range / speed){
        //    return;
        //}
        let y = y_range - (speed * t * 60) % (y_range * 60) / 60;
        if (t > Math.floor(duration/(y_range/speed)) * y_range/speed){
        //if (t > duration && y < 10){
            console.log(t);
            return;
        }
        let model_transform = mt.times(Mat4.translation([0, y, 0]));
        model_transform = model_transform.times(Mat4.scale([0.1,0.2,0.1]));
        this.shapes.rain.draw(graphics_state, model_transform, this.materials.rain);
    }

    draw_rain(graphics_state, t, duration){
        let x_range = 10;
        let y_range = 22;
        let z_range = 5;
        let gap = 1;
        let speed = 5;
        for (let i=-x_range+0.5; i<x_range-0.5; i+=gap){
            for (let j=-z_range+0.5; j<z_range-0.5; j+=gap){
                let time_offset = 1 - Math.cos((i+1) * (j+1));
                let transparency = (duration - t) / duration;
                this.draw_one_rain(graphics_state, t - time_offset, y_range, 10, Mat4.translation([i,0,j]), duration, time_offset);
            }
        }
        if (t>duration + 4 ){
            this.rain_on = false;
            this.rained = true;
        }

    }

    draw_cloud(graphics_state, t){
        let cloud_transform = Mat4.identity();

        cloud_transform = cloud_transform.times(Mat4.translation([-10*t, 23, -3]));
        let cloud1 = cloud_transform.times(Mat4.scale([10, 1, 1]));
        this.shapes.cloud.draw(graphics_state, cloud1, this.materials.cloud);

        let cloud2 = cloud_transform.times(Mat4.translation([+5, +1, -3.3]))
            .times(Mat4.scale([9.5, 1, 1]));
        this.shapes.cloud.draw(graphics_state, cloud2, this.materials.cloud.override({ambient:0.75}));

        let cloud3 = cloud_transform.times(Mat4.translation([-3, +1.5, -3.5]))
            .times(Mat4.scale([10.5, 1.5, 1]));
        this.shapes.cloud.draw(graphics_state, cloud3, this.materials.cloud.override({ambient:0.73}));
    }

    drop_apple_1(graphics_state, t){
        let apple_transform = Mat4.identity();
//<<<<<<< HEAD
//
//        if (17-t > h){
//            apple_transform = apple_transform.times(Mat4.translation([5, 17-t, -10]));
//        }else if (17 - t > h - 1){
//            var x = document.getElementById("appleFall");
//            x.play();
//            apple_transform = apple_transform.times(Mat4.translation([5, t - 17 + 2 * h, -2*(t - 17 + h) -10]));
//        }else if (17 - t > h - 2){
//            apple_transform = apple_transform.times(Mat4.translation([5, 19 - t, -2*(t - 17 + h)-10]));
//        }else if (17 + 2 - t > 0){
//            apple_transform = apple_transform.times(Mat4.translation([5, 19 - t, -14]));
//        }else{
//            apple_transform = apple_transform.times(Mat4.translation([5, 0, -14]));
//            this.celebrate = true;
//        }
//=======
        apple_transform = apple_transform.times(Mat4.translation([5, 17, -10]));
        apple_transform = apple_transform.times(Mat4.translation([0, -(t ** 2), 0]));
        //apple_transform = apple_transform.times(Mat4.scale([0.7,0.7,0.7]));
        this.shapes.apple.draw(graphics_state, apple_transform, this.materials.apple);
    }

    drop_apple_2(graphics_state, t){
        let apple_transform = Mat4.identity();

        //  2s
            apple_transform = Mat4.identity().times(Mat4.translation([5, 8, -10]));
            apple_transform = apple_transform.times(Mat4.translation([0.5*(t**2), 0, 0]));
            apple_transform = apple_transform.times(Mat4.translation([0, t, 0]));
            //apple_transform = apple_transform.times(Mat4.scale([0.7,0.7,0.7]));
            this.shapes.apple.draw(graphics_state, apple_transform, this.materials.apple);
            if (!this.apple_audio){
                this.apple_fall_a.play();
                this.apple_audio = true;
            }


    }
    drop_apple_3(graphics_state, t){
        let apple_transform = Mat4.identity();

        //5s
        apple_transform = Mat4.identity().times(Mat4.translation([7, 10, -10]));
        apple_transform = apple_transform.times(Mat4.translation([t, 0, 0]));
        apple_transform = apple_transform.times(Mat4.translation([0, -0.38*(t**2),  0]));
        //apple_transform = apple_transform.times(Mat4.scale([0.7,0.7,0.7]));
        this.shapes.apple.draw(graphics_state, apple_transform, this.materials.apple);

    }
    drop_apple_4(graphics_state, t){
        let apple_transform = Mat4.identity();
        apple_transform = Mat4.identity().times(Mat4.translation([12, 0.6, -10]));
        //apple_transform = apple_transform.times(Mat4.scale([0.7,0.7,0.7]));
        this.shapes.apple.draw(graphics_state, apple_transform, this.materials.apple);
        this.celebrate = true;

    }

    drop_poop(graphics_state, t){
        //poop-------------------------------------------------------------------------
        let poop_mat = Mat4.identity();
        poop_mat = poop_mat.times(Mat4.translation([0, -0.8*((t+5)**2),0]));
        poop_mat = poop_mat.times(Mat4.translation([10*t, 20,-10]));
        //poop_mat = poop_mat.times(Mat4.scale([0.8,0.8,0.8]));
        poop_mat = poop_mat.times(Mat4.scale([1.5*(t+5)/5,1.5*(t+5)/5,1.5*(t+5)/5]));
        this.shapes.poop.draw(graphics_state, poop_mat, this.materials.poop);

        //if (poop lands){
        // this.cloud_pause = false;
        //}
    }

    //bird
    draw_bird(graphics_state, t){
        const yellow = Color.of( 1,1,0,1 );
        const black = Color.of(0,0,0,1);
        const red = Color.of(139/255,0,0,1);
        const gold = Color.of(1,215/255, 0,1);

        let bird_transform = Mat4.identity();


        bird_transform = bird_transform.times(Mat4.translation([10*t, 20, -10]));
        let head = bird_transform.times(Mat4.scale([0.65, 0.65, 0.65]));
        head = head.times(Mat4.translation([1,0,0]));
        this.shapes.ball.draw(graphics_state, head, this.plastic.override({color: yellow}));

        let body = bird_transform.times(Mat4.scale([2, 0.50, 1]));
        body = body.times(Mat4.translation([-1,0,0]));
        this.shapes.ball.draw(graphics_state, body, this.plastic.override({color: yellow}));

        let eye = bird_transform.times(Mat4.translation([0.5, 0, 0.66]));
        eye = eye.times(Mat4.scale([0.1, 0.1, 0.1]));
        eye = eye.times(Mat4.translation([1,0,0]));
        this.shapes.ball.draw(graphics_state, eye, this.plastic.override({color: black}));

        let mouth = bird_transform.times(Mat4.translation([1, -0.44, 0]))
            .times(Mat4.scale([0.7, 0.5, 0.5]));
        this.shapes.tri.draw(graphics_state, mouth, this.plastic.override({color: red}));

        var rotate_angle = Math.PI / 2.2 * (1 + Math.cos(2 * Math.PI * t));

        
        let inner_wing = bird_transform.times(Mat4.translation([-1, -0.5, -1]))
            .times(Mat4.rotation(rotate_angle, Vec.of(0,1,0) ) )
            .times(Mat4.scale([1.5, 1, 2]));
        this.shapes.tri.draw(graphics_state, inner_wing, this.plastic.override({color: gold}));

        let outer_wing = bird_transform.times(Mat4.translation([-1, -0.5, 1]))
            .times(Mat4.rotation(rotate_angle, Vec.of(0,1,0) ) )
            .times(Mat4.scale([1.5,1,2]));
        this.shapes.tri.draw(graphics_state, outer_wing, this.plastic.override({color: gold}));
    }

    set_camera(graphics_state){
       if (this.camera_lock){
           graphics_state.camera_transform = Mat4.look_at(this.camera_pos[0], this.camera_pos[1], this.camera_pos[2]);
       }
    }

    animation_controll(graphic_state){
        this.bird_pause = false;

    }

    draw_2000(graphics_state){
        this.shapes.years.draw(graphics_state, Mat4.identity().times(Mat4.translation([0,12,18])).times(Mat4.scale([18,18,18])).times(Mat4.rotation(Math.PI/12, Vec.of(-1,0,0))), this.materials.years);
        if(!this.years_audio){
            this.two_thousand_a.play();
            this.years_audio = true;
        }
    }

    display(graphics_state) {
        //this.set_camera(graphics_state);
        graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

        if(this.celebrate){
            this.draw_fma(graphics_state, t);
        }

        if (!this.animation_pause){
            this.animation_t += dt;
        }

        if (this.rain_on){
            this.rain_t += dt;
        }
        let duration = 5;
        if (this.rain_t < duration + 4 && this.rain_t > 0){
            this.draw_rain(graphics_state, this.rain_t, duration);
            this.rain_a.play();
            if (this.rain_t > duration + 2){
                this.rain_a.pause();
            }
        }

        if (!this.bird_pause) {
            this.bird_t += dt;
        }
        if (this.bird_t < 20 && this.bird_t > -10) {
            if(!this.bird_audio && this.bird_t > -5){
                this.bird.play();
                this.bird_audio = true;
            }
            this.draw_bird(graphics_state, this.bird_t);

        }

        if (!this.cloud_pause) {
            this.cloud_t += dt ;
        }
        if (this.cloud_t < 0 && this.bird_t > -10) {
            this.draw_cloud(graphics_state, this.cloud_t);
        } else {
            if (this.tmp_cloud_t < 5)
                this.draw_cloud(graphics_state, 0);
            else
                this.draw_cloud(graphics_state, this.tmp_cloud_t - 5);
            if (!this.rained){
                this.tmp_cloud_t += dt;
                this.rain_on = true;
                duration = 5;
                if (this.tmp_cloud_t > duration + 3 && this.tree_pause){
                    this.tree_pause = false;
                    this.apple_pause = false;
                    this.newton_start = true;
                }
                if (this.rain_t < duration + 4 && this.rain_t > 0) {
                    this.draw_rain(graphics_state, this.rain_t, duration);
                }
            }
        }

        if (this.newton_start){
            this.newton_t += dt;
        }

        if (this.apple_t > -8 && this.apple_t < -3){
            this.draw_2000(graphics_state);
        }

        if (this.apple_t >= -7){
            this.draw_newton(graphics_state, t, dt);
        }

        if (!this.apple_pause) {
            this.apple_t += dt;
        }
        // if (this.apple_t > 0 && this.apple_t < 30) {
        //     this.drop_apple(graphics_state, 8,  this.apple_t);
        // }

        if(this.apple_t > 0 && this.apple_t < 3)
        {
            this.drop_apple_1(graphics_state, this.apple_t);
        }
        if(this.apple_t > 3 && this.apple_t < 5)
        {
            this.drop_apple_2(graphics_state, this.apple_t-3);
        }
        if(this.apple_t > 5 && this.apple_t < 10)
        {
            this.drop_apple_3(graphics_state, this.apple_t-5);
        }
        if(this.apple_t > 10)
        {
            this.drop_apple_4(graphics_state, this.apple_t-10);
        }

        //this.poop_t +=dt;
        if (this.bird_t > -10 && this.bird_t < 0) {
            this.drop_poop(graphics_state, this.bird_t);
        }
        if(this.bird_t >= 0 && this.bird_t < 10) //cloud time
        {
            this.cloud_pause = false;
            let poop_mat2 = Mat4.identity().times(Mat4.translation([0,0.5,-10])).times(Mat4.scale([1.5,1.5,1.5]));
            this.shapes.poop.draw(graphics_state, poop_mat2, this.materials.poop);
        }




        let ground_transform = Mat4.identity();
        ground_transform = ground_transform.times(Mat4.translation(Vec.of((this.x_upper_bound + this.x_lower_bound) / 2,
            (this.y_upper_bound + this.y_lower_bound) / 2, (this.z_upper_bound + this.z_lower_bound) / 2)));
        ground_transform = ground_transform.times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)));
        ground_transform = ground_transform.times(Mat4.scale([(this.x_upper_bound - this.x_lower_bound) / 2,
            (this.z_upper_bound - this.z_lower_bound) / 2, (this.y_upper_bound - this.y_lower_bound) / 2]));
        this.shapes.ground.draw(graphics_state, ground_transform, this.materials.ground);

        //test
        let model_transform = Mat4.identity();
        //model_transform = model_transform.times(Mat4.translation([0, 20, -5]));
        //model_transform = model_transform.times(Mat4.rotation(t, Vec.of(1, 0, 0)));
        //model_transform = model_transform.times(Mat4.translation([0,-0.4,0]));
        //model_transform = model_transform.times(Mat4.scale([0.8,1,0.01]));
        //this.shapes.leaf.draw(graphics_state, model_transform, this.materials.apple.override({color: Color.of(0,0.4,0,1)}));


        //grass
        let shear_mat = this.shear_mat =  Mat.of(
            [1, 0.1 * Math.cos(Math.PI * t) + 0.2, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        );
        let grass_transform = Mat4.identity();

        //let offset;
        let field_gap = 20;
        let rand;
        for (let i = this.x_lower_bound + 8; i < this.x_upper_bound - 15; i += field_gap) {
            for (let j = this.z_lower_bound - 5; j < this.z_upper_bound - 20; j += field_gap) {
                grass_transform = Mat4.translation([i + 10, 0, j + 14]).times(grass_transform.times(shear_mat));
                this.shapes.field.draw(graphics_state, grass_transform, this.materials.bunch_grass);
                grass_transform = Mat4.identity();
            }
        }




        if (!this.tree_pause) {
            this.tree_xz_t += dt;
            this.tree_y_t += dt;
        }
        if (this.tree_xz_t <= 0 && this.tree_y_t <= 0){
            return;
        }

        if (this.tree_y_t >0 && this.tree_y_t < 25) {
            this.tree_a.play();
        }
        if (this.tree_y_t > 25){
            this.tree_a.pause();
        }
            //root
        model_transform = Mat4.identity();
        model_transform = model_transform.times(Mat4.translation([0, 3, -10]));
        model_transform = model_transform.times(Mat4.rotation(Math.PI / 5, Vec.of(0, 1, 0)));
        this.shapes.main_trunk.draw(graphics_state, model_transform, this.materials.branch
            .override({xz_t: this.tree_xz_t, y_t: this.tree_y_t, a: 0.25, b: 2, c: -1}));
        model_transform = model_transform.times(Mat4.translation([0, -0.5, 0]));
        model_transform = model_transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 1, 0)));
        this.shapes.main_trunk.draw(graphics_state, model_transform, this.materials.branch
            .override({xz_t: this.tree_xz_t, y_t: this.tree_y_t, a: 0.25, b: 2, c: -1}));
        model_transform = model_transform.times(Mat4.translation([0, -0.5, 0]));
        model_transform = model_transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 1, 0)));
        this.shapes.main_trunk.draw(graphics_state, model_transform, this.materials.branch
            .override({xz_t: this.tree_xz_t, y_t: this.tree_y_t, a: 0.25, b: 2, c: -1}));
        model_transform = model_transform.times(Mat4.translation([0, -0.5, 0]));
        model_transform = model_transform.times(Mat4.rotation(Math.PI / 2, Vec.of(0, 1, 0)));
        this.shapes.main_trunk.draw(graphics_state, model_transform, this.materials.branch
            .override({xz_t: this.tree_xz_t, y_t: this.tree_y_t, a: 0.25, b: 2, c: -1}));

        //main_trunk
        this.shapes.main_trunk.draw(graphics_state, Mat4.translation([0, 0, -10]), this.materials.main_trunk
            .override({xz_t: this.tree_xz_t, y_t: this.tree_y_t}));
        this.shapes.main_trunk.draw(graphics_state, Mat4.translation([0, this.cylinder_h, -10]), this.materials.main_trunk
            .override({xz_t: this.tree_xz_t, y_t: this.tree_y_t - this.cylinder_h / this.y_speed}));


        let start_y = 8;
        this.recursive_draw(graphics_state, 0, start_y, this.tree_xz_t, this.tree_y_t - start_y / this.y_speed,
            0.8, 1.5, 1, Mat4.translation([0, start_y, 0]));


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
        //calculate end point:
        //  x += a * pow(y, b)
        if (r_percentage > 0.10) {
            for (let offset of [0.6, 0.98]) {
                let end_x = a * Math.pow(this.cylinder_h * offset, b);
                let end_y = this.cylinder_h * c * offset;
                let pass_out_mt = mt.times(random_rotation).times(Mat4.translation([end_x, end_y, 0]));
                let new_c = c * 0.8;
                let new_y_t = (0.8 + noise) * (y_t - this.cylinder_h * offset / this.y_speed);
                if (r_percentage < 0.2 && new_c > 0){
                    new_c = -new_c;
                }
                this.recursive_draw(graphics_state, end_x, end_y, (0.8 + noise) * xz_t, new_y_t,
                    1.00 * a, 1.5 / b, new_c, pass_out_mt, r_percentage * this.decay, offset);
            }
        }
        if (r_percentage < 0.20){
            for (let offset of [0.4, 0.8]) {
                let end_x = a * Math.pow(this.cylinder_h * offset, b);
                let end_y = this.cylinder_h * c * offset;
                let pass_out_mt = mt.times(random_rotation).times(Mat4.translation([end_x, end_y, 0]));
                model_transform = world_translation.times(pass_out_mt);
                let apple_t = 0;
                let new_y_t = (y_t - this.cylinder_h * offset / this.y_speed);
                if (new_y_t > 0){
                    apple_t = 0.05 * new_y_t;
                }
                if (apple_t > 1){
                    apple_t = 1;
                }
                let apple_transform = model_transform.times(Mat4.scale([apple_t, apple_t, apple_t])).times(Mat4.translation([0,-1,0]));
                let trigger = Math.cos(end_y * r_percentage * 8 );
                if (trigger > 0.9 && r_percentage < 0.1) {
                    this.shapes.apple.draw(graphics_state, apple_transform.times(Mat4.scale([0.5, 0.5, 0.5])), this.materials.apple);
                    this.shapes.cylinder.draw(graphics_state, apple_transform, this.materials.wood);
                }
                model_transform = model_transform.times(Mat4.scale([apple_t, apple_t, apple_t]))
                    //.times(Mat4.translation([0,0.3,0]))
                    .times(Mat4.scale([1,1,0.3]))
                    .times(Mat4.rotation(Math.PI * offset * end_y, Vec.of(1,1,0)))
                    .times(Mat4.rotation(Math.PI * offset * end_y, Vec.of(-1,0,0)))
                    .times(Mat4.rotation(Math.PI * offset * end_y, Vec.of(-1,1,0)));
                this.shapes.grass1.draw(graphics_state, model_transform, this.materials.grass1);
            }
            for (let offset of [0.4, 0.6, 0.8]) {
                let end_x = a * Math.pow(this.cylinder_h * offset, b);
                let end_y = this.cylinder_h * c * offset;
                let pass_out_mt = mt.times(random_rotation).times(Mat4.translation([end_x, end_y, 0]));
                let shear_mat = this.shear_mat =  Mat.of(
                    [1, 0.1 * Math.cos(Math.PI * y_t / 6) + 0.0 * (Math.cos(Math.PI * offset * end_y / 200)) + 0.2, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1],
                );
                model_transform = world_translation.times(pass_out_mt);
                let leaf_t = 0;
                let new_y_t = (y_t - this.cylinder_h * offset / this.y_speed);
                if (new_y_t > 0){
                    leaf_t = 0.05 * new_y_t;
                }
                if (leaf_t > 1){
                    leaf_t = 1;
                }
                model_transform = model_transform.times(Mat4.scale([leaf_t, leaf_t, leaf_t]))
                //.times(Mat4.translation([0,0.3,0]))
                    .times(Mat4.scale([1,1,0.3]))
                    .times(Mat4.rotation(Math.PI * offset * end_y, Vec.of(1,1,0)))
                    .times(Mat4.rotation(Math.PI * offset * end_y, Vec.of(-1,0,0)))
                    .times(Mat4.rotation(Math.PI * offset * end_y, Vec.of(-1,1,0)))
                    .times(this.shear_mat);
                this.shapes.grass1.draw(graphics_state, model_transform, this.materials.grass1);
            }
        }
    }
}



