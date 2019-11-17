window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
class Assignment_Three_Scene extends Scene_Component {
  constructor(context, control_box)     // The scene begins by requesting the camera, shapes, and materials it will need.
  {
    super(context, control_box);    // First, include a secondary Scene that provides movement controls:
    if (!context.globals.has_controls)
      context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

    context.globals.graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 20, 20), Vec.of(0, 10, -10), Vec.of(0, 1, 0));
    this.initial_camera_location = Mat4.inverse(context.globals.graphics_state.camera_transform);

    const r = context.width / context.height;
    context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

    const shapes = {
      ground: new Cube(),
      grass: new Grass(5, 10),
      apple: new Apple(100, 100),
      apple_2: new Subdivision_Sphere(4),
      cylinder: new Cylinder(15, 15)
    }
    //shapes.box_1.texture_coords = shapes.box_1.texture_coords.map(v => Vec.of(v[0] * 2, v[1] * 3));
    this.submit_shapes(context, shapes);

    // Make some Material objects available to you:
    this.materials =
        {
          test: context.get_instance(Phong_Shader).material(Color.of(1, 1, 0, 1), {ambient: .2}),
          apple: context.get_instance(Phong_Shader).material(Color.of(1, 0, 0, 1), {ambient: 0}),
          ground: context.get_instance(Phong_Shader).material(Color.of(153 / 255, 76 / 255, 0, 1), {ambient: 0.4}),
          grass: context.get_instance(Phong_Shader).material(Color.of(0, 1, 0, 1), {ambient: 0.5}),
          trunk: context.get_instance(Phong_Shader).material(Color.of(102 / 255, 51 / 255, 0, 1), {ambient: .3})

        }

    this.lights = [new Light(Vec.of(0, 10, 5, 1), Color.of(0, 1, 1, 1), 1000)];
  }

  make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
  {
    this.key_triggered_button("View solar system", ["0"], () => this.attached = () => this.initial_camera_location);
    this.new_line();
    this.key_triggered_button("Attach to planet 1", ["1"], () => this.attached = () => this.planet_1);
    this.key_triggered_button("Attach to planet 2", ["2"], () => this.attached = () => this.planet_2);
    this.new_line();
    this.key_triggered_button("Attach to planet 3", ["3"], () => this.attached = () => this.planet_3);
    this.key_triggered_button("Attach to planet 4", ["4"], () => this.attached = () => this.planet_4);
    this.new_line();
    this.key_triggered_button("Attach to planet 5", ["5"], () => this.attached = () => this.planet_5);
    this.key_triggered_button("Attach to moon", ["m"], () => this.attached = () => this.moon);
  }

  display(graphics_state) {
    graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
    const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;


    // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 2 and 3)
    //cylinder
    if (t > 0 && t < 3) {
      let trunk_matrix = Mat4.identity().times(Mat4.scale([1, t, 1]));
      this.shapes.cylinder.draw(graphics_state, trunk_matrix, this.materials.trunk);
    } else {
      let trunk_matrix = Mat4.identity().times(Mat4.scale([1, 3, 1]));
      this.shapes.cylinder.draw(graphics_state, trunk_matrix, this.materials.trunk);
    }


    let z_lower_bound = -80, z_upper_bound = 20;
    let y_lower_bound = -200, y_upper_bound = 0;
    let x_lower_bound = -100, x_upper_bound = 100;

    let ground_transform = Mat4.identity();
    ground_transform = ground_transform.times(Mat4.translation(Vec.of((x_upper_bound + x_lower_bound) / 2,
        (y_upper_bound + y_lower_bound) / 2, (z_upper_bound + z_lower_bound) / 2)));
    ground_transform = ground_transform.times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)));
    ground_transform = ground_transform.times(Mat4.scale([(x_upper_bound - x_lower_bound) / 2,
      (z_upper_bound - z_lower_bound) / 2, (y_upper_bound - y_lower_bound) / 2]));
    this.shapes.ground.draw(graphics_state, ground_transform, this.materials.ground);

    //apple
    let model_transform = Mat4.identity();
    model_transform = model_transform.times(Mat4.translation([0, 3, -10]));
    model_transform = model_transform.times(Mat4.rotation(t, Vec.of(1, 0, 0)));
    this.shapes.apple_2.draw(graphics_state, model_transform, this.materials.apple);

    //grass
    let grass_transform = Mat4.identity();
    let shear_mat = Mat.of(
        [1, 0.1 * Math.cos(Math.PI * t) + 0.3, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    );
    let offset;
    for (let i = -50; i < 50; i += 1.5) {
      for (let j = -60; j < -10; j += 1.5) {
        offset = Math.cos(i) * Math.cos(j);
        grass_transform = grass_transform.times(Mat4.translation([i + offset, 0, j + offset]));
        grass_transform = grass_transform.times(Mat4.rotation(offset * Math.PI / 20, Vec.of(0, 0, 1)));
        grass_transform = grass_transform.times(shear_mat);
        this.shapes.grass.draw(graphics_state, grass_transform, this.materials.grass);
        grass_transform = Mat4.identity();
      }
    }
  }
}

