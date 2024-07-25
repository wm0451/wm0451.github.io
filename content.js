// module aliases
var Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Bodies = Matter.Bodies,
MouseConstraint = Matter.MouseConstraint,
Composite = Matter.Composite,
Mouse = Matter.Mouse;

// create an engine
var engine = Engine.create(),
world = engine.world;

var canvas = document.createElement('canvas'),
context = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.995;
canvas.height = window.innerHeight * 0.995;

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: canvas.width,
        height: canvas.height,
		wireframes: false
    }
});

// create bounding boxes
var ground = Bodies.rectangle((canvas.width / 2), (canvas.height + 100), canvas.width, 200, {
    isStatic: true
});
var ceiling = Bodies.rectangle((canvas.width / 2), -100, canvas.width, 200, {
    isStatic: true
});
var leftWall = Bodies.rectangle(-100, (canvas.height / 2), 200, canvas.height, {
    isStatic: true
});
var rightWall = Bodies.rectangle((canvas.width + 100), (canvas.height / 2), 200, canvas.height, {
    isStatic: true
});

//create objects
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground, ceiling, leftWall, rightWall]);

// add mouse control
var mouse = Mouse.create(render.canvas);
mouseConstraint = MouseConstraint.create(engine, {
	mouse: mouse,
	constraint: {
		stiffness: 0.2,
		render: {
			visible: false
		}
	}
});
Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
