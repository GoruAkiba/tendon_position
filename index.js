
// // init data
// const { hEdge, hMid, H, anchor_length } = require("./data.json");


// // calculating zEdge & zMid
// var zEdge = H - hEdge,
// 	zMid = H - hMid;

// // calc A, B, C
// var A = (zMid - zEdge)/(0.5*anchor_length)**2*1000,
// 	B = -A * (anchor_length/1000),
// 	C = hEdge/1000;


// // calc Z along anchor_length
// var span = 1000,
// 	acuracy = 2,
// 	z_nd = [];
// var Zi = ({x,A,B,C,acuracy}) => {
// 	x = x/1000
// 			return [x*1000,round((A*x**2+B*x+C)*1000,acuracy)] 
// 		},
// 	round = (a,b) => {
// 			let rn = 10**b;
// 			return Math.floor(a*rn)/rn
// 		};

// // iteration for each x along anchor_length
// for(var i =0; i <= Math.floor(anchor_length/span); i++){
// 	var x = i == Math.floor(anchor_length/span) ? anchor_length : i*span;

// 	z_nd.push(Zi({x,A,B,C,acuracy}));
// }

// // display z_nd
// console.log(` A = ${A}\n B = ${B}\n C = ${C}`)
// console.log(z_nd);


// init
console.log("analysis begin")
const { data } = require("./list_data.json");
const tendon_pos = require("./module_pos.js");
const fs = require("fs");


// init data
var H = 2100,
	anchor_length = 50500,
	span = 1000,
	acuracy = 2;

var tendons = new Map();


data.map((e,i) => {
	tendons.set(i, new tendon_pos({...e,H:H,anchor_length:anchor_length,span:span,acuracy:acuracy}))
	// console.log(i)
	// console.log(tendons.get("tendon_"+i).y_pos)
})

// console.log(tendons.get("tendon_0"))


// save data
// var file_name = "tendon_0.txt";

// fs.writeFile(file_name, JSON.stringify(tendons.get("tendon_0").y_pos,null,2),"utf8", (err)=>{
// 	if(err) return console.log(err);

// 	console.log("berhasil menyimpan")

// })


// check if the circle overlap
var ccr = ({x1, y1, r1,x2, y2, r2}) => {
	// pytagorean teoream
	var z = Math.sqrt((x1-x2)**2+(y1-y2)**2);
	return z < r1+r2;
}
var opt = {
	x1:46,
	y1:50,
	x2:76,
	y2:100,
	r2:1,
	r1:50
}

// console.log(ccr(opt))


// init taper of girder
var tp = 500,
	dia = 90;
	rad = (dia*0.7/2+dia)/2; // VSL brochure
console.log(rad);

// tendons = tendons.reverse();

tendons.forEach(async (e,i) => {
	if(i<tendons.size-1){
		var next_ = tendons.get(i+1).y_pos;
		var inReg = await e.y_pos.filter( c => {
			var y2 = next_.find(d => { return d[0] == c[0] });
			if(c[1] < tp){
				var opt = {
					x1:0,
					y1:c[1],
					x2:0,
					y2:y2[1],
					r2:rad,
					r1:rad
				};

				
				// console.log(`[${i}] ${JSON.stringify(opt)}`);
				return ccr(opt); 
			}
			
		});
		await console.log(inReg);
		}
	
})

// console.log(tendons.get(5))
