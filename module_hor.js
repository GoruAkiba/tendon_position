const module_pos = require("./module_pos.js")

class module_hor{
	constructor({x_firstContra, contra, del_y, req_r, anchor_length, z_edge, z_mid, Bf, span, acuracy}){
		// super();

		this.trigonometry = require("./module_trigonometry.js");
		this.round = (a,b) => {
			let rn = 10**b;
			return Math.round(a*rn)/rn
		};

		this.ang = 90 - this.trigonometry.toDeg(Math.acos(0.5*del_y/req_r)),
    	this.z_firstContra = this.round(req_r * this.trigonometry.cosd(this.ang),acuracy);
    	var opt ={
			hEdge : z_edge + this.z_firstContra, 
			hMid : z_mid , 
			z_edge : 0, 
			z_mid : 0, 
			H : Bf, 
			anchor_length : 2*(anchor_length/2 - x_firstContra), 
			span : span, 
			acuracy : acuracy
		}
		var zpos = new module_pos(opt);
		console.log(zpos);
		this.z_pos = zpos.y_pos.map(e => {return [e[0]+x_firstContra,e[1]]});
	}
}

module.exports = module_hor;