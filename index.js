// init data and modules
const tendon_pos = require("./module_pos.js");
const tendon_hor = require("./module_hor.js");
const module_contra = require("./module_contra.js");
const fs = require("fs");

/**
 * load all requirement data from list_data.json
 */
const { data, H, anchor_length, span, Bf, acuracy, limit, dia} = require("./list_data.json");

/**
 * Define container
 */
var tendonGroup = new Map(),
	tendons = new Map(),
	coupleHorizon = new Map(),
	contra = new Map(),
	horizon = new Map();


/**
 * Main Worker
 * for each data on data, do calc the vertical coordinate
 */
data.map((e,i) => {

	// define option data for calc tendon's vertical coordinate
	// e => contain tendon properties define before {"hEdge", "hMid", "z_edge", "z_mid"} 
	var opt = {
		...e,
		H:H,
		anchor_length:anchor_length,
		span:span,
		acuracy:acuracy
	};

	// calc and store tendon vertical coordinate
	tendons.set(i, new tendon_pos(opt))
	
	// collect horisontal similar strand member 
	var ten = tendons.get(i);
	if(ten. horisontalAlignment){
		var coupleName = `${Math.abs(e.z_edge)}:${Math.abs(e.z_mid)}`;
		var cplH = coupleHorizon.get(coupleName);
		if(!cplH){
			coupleHorizon.set(coupleName,{
				z_edge : e.z_edge,
				z_mid : e.z_mid,
				similar : [i]
			});
		} else {
			var similar = cplH.similar;
			coupleHorizon.set(coupleName,{
				z_edge : e.z_edge,
				z_mid : e.z_mid,
				similar:[...similar,i]
			});
		}
		
	}
	
	// comment this for display each result
	// console.log(tendons.get(i))
});


/**
 * Predict vertical contra tendon
 */
tendons.forEach(async (e,i) => {
	if(tendons.size-1 > i){

		// define option data to predict tendon's vertical coordinate that contra each other
		var opt = {
			ten1 : e.y_pos,
			ten2 : tendons.get(i+1).y_pos,
			limit : limit,
			dia: dia
			};

		// predict and store contra coordinate
		await contra.set(i,new module_contra(opt))
	}

});

coupleHorizon.forEach(async (e,i) => {
	var cntr = contra.get(e.similar[0]),
		hor = new tendon_hor({...cntr, Bf: Bf/2, z_edge: e.z_edge, z_mid: e.z_mid, anchor_length:anchor_length, span:span, acuracy : acuracy})
	e.similar.map(d=>{
		var identitas = data[d].z_mid > 0? 1 : -1;
		horizon.set(d,{...hor, identitas:identitas});
	})
});


tendons.forEach(async (e,i)=>{
	var origin_hor = horizon.get(i) || null,
		coordinate = e.y_pos.map(d => {
			if(!origin_hor) return [...d, 0];
			var z = origin_hor.calc(d[0],acuracy) * origin_hor.identitas;

			return [...d, z == -0? 0 :z];
		});

	tendonGroup.set(i,{
		coordinate:coordinate,
		origin_hor:origin_hor,
		origin_ver:e
	});
})



// var d = new tendon_hor({...contra.get(4), Bf: 700/2, z_edge: 0, z_mid: -150, anchor_length:anchor_length, span:span, acuracy : acuracy});
// var d = tendons.get(1);
// console.log(d.calc(1300));
// console.log(tendons.get(1))
// console.log(JSON.stringify(tendonGroup.get(5).coordinate,null,4));