//create engine
const engine = Matter.Engine.create({
	enableSleeping: false, 
	positionIterations: 5, 
	gravity: {scale: 0}
});
world = engine.world;

//debug renderer
var debug = Matter.Render.create({
	element: document.body,
	engine: engine,
	options: {
		width: window.innerWidth,
		height: window.innerHeight,
		wireframeBackground: '#ffffff',
		showCollisions: true,
		hasBounds: true,
		showBounds: true,
		showPerformance: true,
		showStats: true,
		showVertexNumbers: true
	}
});
/* Matter.Render.run(debug); */

// create runner
var runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);

//create bounding boxes
const ground = Matter.Bodies.rectangle(
  (window.innerWidth / 2), (window.innerHeight + 100), window.innerWidth, 200, {isStatic: true}
);
const ceiling = Matter.Bodies.rectangle(
	(window.innerWidth / 2), -100, window.innerWidth, 200, {isStatic: true}
);
const left_wall = Matter.Bodies.rectangle(
	-100, (window.innerHeight / 2), 200, window.innerHeight, {isStatic: true}
);
const right_wall = Matter.Bodies.rectangle(
	(window.innerWidth + 100), (window.innerHeight / 2), 200, window.innerHeight, {isStatic: true}
);

//create mouse constraint (to move objects with mouse)
const mouseConstraint = Matter.MouseConstraint.create(
  engine, {element: document.body}
);

//add objects
Matter.Composite.add(
  engine.world, [ground, ceiling, left_wall, right_wall, mouseConstraint]
);

//List of objects, manually entered
let dom_object_names = [
	"#landing_mainHeader", 
	"#landing_para1", 
	"#landing_para2", 
	"#landing_box1",
	"#landing_box2",
	"#landing_box3",
	"#landing_box4",
	"#landing_box5",
	"#landing_box6"
];

class Body {
	constructor(input, world){
		//div = DOM object
		//physicsBox = matter object
		this.div = input;
		
		this.offsets = this.div.getBoundingClientRect();
		this.x = this.offsets.x;
		this.y = this.offsets.y;
		
		this.width = this.offsets.width;
		this.height = this.offsets.height;
		
		this.physicsBox = Matter.Bodies.rectangle(this.offsets.x + (this.width/2), this.offsets.y + (this.height/2), this.width, this.height);
		Matter.Composite.add(world, this.physicsBox);
		
		this.update();
		/* console.log(this.div.scrollWidth, this.div.scrollHeight, this.div.clientWidth, this.div.clientHeight);
		console.log(this.offsets);
		console.log(this.width, this.height);
		console.log(this.physicsBox.vertices);
		console.log("--"); */
	}
	update(){
		let pos = this.physicsBox.position;
		let angle = this.physicsBox.angle;
		let degrees = angle * (180 / Math.PI);
		this.div.style.transform = `translate(${pos.x -(this.width/2)-this.x}px, ${pos.y-(this.height/2)-this.y}px) rotate(${degrees}deg)`;
	}
	toggle(){
		this.physicsBox.isStatic = !this.physicsBox.isStatic
	}
}
let bodies = [];

//new init function
function phys_init(){
	for(let i = 0; i < dom_object_names.length; i ++){
		let dom_obj = document.querySelector(dom_object_names[i]);
		bodies[i] = new Body(dom_obj, engine.world);
	}
}

function togglePhysics(){
	if(engine.gravity.scale == 0){
		engine.gravity.scale = 0.001;
	} else {
		engine.gravity.scale = 0;
	}
	
	let btn = document.querySelector("#button_arrow");
	btn.style.transition = "0.2s all";
	btn.style.transform += `rotate(${180}deg)`;
};

let i = 0;

//re-render
(function rerender() {
	//object_render();
	for(let b of bodies){
		b.update();
	}
	requestAnimationFrame(rerender);
})();