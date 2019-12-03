# Project Outline
Our team project is a 3D animation telling a story of how an apple tree is formed in our grass island in the middle of nowhere and 2000 years after the apple tree exists, an apple falls off the tree and hit Newton’s head, which is also the moment when he realized gravity and came up with the theory of Newton’s Second Law. At first a bird flies by to the grass island and drop a poop that contains the seeds of our apple tree. Later a cloud comes by and the sky begins to rain. With the moisture the rain has provided, the apple tree starts growing and many years later an apple of the tree drops on Newton’s head and he begins to cheer as he discovers gravity.
 

# Contribution:
 
## Shuhua Zhan (705190671):
- I created an object of one bunch of grass which is formed by three pieces of grass with different parabolas curves offsetting from the same point. Then with this Bunch_Grass object, I created another object called Field with a length of 10 and width of 5, containing numbers of randomly scaled Bunch_Grass. Then I use transform matrices to apply Field all over the island with gap of 20. In order to simulate grass fluttering in the wind with time, I multiply the Field matrix with a shear matrix with respect to time.
- Created a poop object that is formed by five scaled sphere in varied sizes stacking together with the largest-size oblates in the bottom and the smallest one on top. The poop is dropped from the position of the bird somewhere while it’s flying and falls along a parabola track, which is achieved by multiplying translation matrix with respect to time where x changes with the same speed as the bird and y axis changes with an acceleration of 0.8.
- Created the animation of apple dropping, which is achieved by using transform matrices with respect to time. At first it drops straight on Newton’s head and y axis changes with an acceleration of 1 with respect to t^2. After it hit Newton’s head, the movement follows a parabola track and land on the ground.
- Grass island ground texture mapping.
- Helped finding sound effects rain_falls and tree_grow.

 
## Dongyao Liang (705313832):
- Tree growing animation:
  - I created a cylinder shape that is made up of many small cubes <b>(practical system)</b>
  - rewritten the vertex_glsl function as an interface for animation:
it takes parameters (time variables, growing speed and OS_position) to determine what vertex are visible at what time. for example distance(OS_position, origin or (0,y,0) < t * grow_speed
  - we also want to blend the cylinder, so we pass in some variables (a, b, c) to the vertex_glsl function such that\: <b>new_x = x + a * y^(b) and new_y = c * new_y</b>. By changing a, b and c, we can make some branches of the tree. They are blended in xy plane. By giving rotation over y-axis, we can make the cylinder grows in many directions. 
  - the vertex_glsl function also takes in variables bottom radius and a decay (0-1), so we can make the cylinder smaller and shorter on higher level branches.
  - To connect different style cylinders together to make it look like a tree, I made a recursion. It takes in time_variables, radius, a, b, c, and radius to pass into vertex_glsl to make animation. To be able to connect them, the recursion takes in a model_transform of the bottom center, multiply with a random y-axis rotation, as the model_transform for the current cylinder. And precalculate the bottom center of the next level cylinder using the calculation (new_x = x+a*y^(b)). multiply it with the current model_transform and pass it out to the next recursion as the movement of the bottom center of the next level cylinder. 
And subtract the time_variables so next level cylinder won’t be drawn before the current cylinder.
Each cylinder has two next level cylinder.
  - When the radius reduces to some point, instead of drawing next level cylinders, it draws apples and leaves and stop the recursion.
For texture, I rewrote it to use OS_position to map instead of f_tex_coord it is made up of a practical system. 
Finally I changed the practical cylinder with two faces of a cube (front and top) instead of the whole cube to reduce the number of points to render.


- Raining:
  - It is also made of a practical system. For each practical, we shoot it from the cloud to ground and reset it to top when it reaches the ground. Each practical are given a random delay to time variable to make the raining more realistic. The random delay is proportional to its world space xyz position. 
 
 
 
 
## Ziying Yu (105182320):
- Created leaves shade by scaling the Grass object and applied texture mapping on leaves.
- cloud: Created cloud shade by scaling the sphere object and achieve the movement by using transform matrix with respect to time.
- bird: Created a bird by combining three spheres as head, body and the eye and three triangle as the wings and mouth. I also applied matrix transformation with respect to time to achieve the movement of the bird along the change of time.
- Help finding sound effect sources such as spongebob, applefall, bird_fly_then_rain, woohoo. 

 
## Junting Luo (605182515):
- I basically drew Isaac Newton. I combined seven different shapes to draw the whole person: hair, head, face, body, hands, feet, and shoes. The most challenging part is the hair and face. We were trying to map an actually image of Newton’s face to the face of the object, but then I found out that if I directly apply the texture on an subdivision_sphere, the face actually appears twice on the sphere, so I created another shape, a cone, by making modifications on the subdivision_sphere constructor, and modify its texture coordinates to get my texture working. 
I also integrated the project with some sound effects that are played on specific scenes. To do this I created several HTML audio elements that connect with the source audio file and can be called and played by the main scene when needed. For example, we have a “duang” sound effect when the apple falls on Newton’s head, which makes the project more appealing. And also we have an audio of the sound of branches, which is played when our tree is growing.
 
## ***All codes are written on our own.***

## How we connect our codes:
- We seperate our new shapes and shader functions in different dependencies_\<name\>.js file to reduce conflict on merging.
- In main_scenes.js, each part of the animation are put in a function which takes in a time variable. To connect them together, we just need to add some trigger boolean and change pass in the correct time variables.
