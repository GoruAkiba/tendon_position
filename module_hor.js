const module_pos = require("./module_pos.js")

class module_hor{
	constructor({x_firstContra, del_y, req_r, anchor_length, z_edge, z_mid, Bf, span, acuracy}){
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
		// console.log(zpos);
		this.A = zpos.A;
		this.B = zpos.B;
		this.C = zpos.C;
		this.z_pos = zpos.y_pos.map(e => {return [e[0]+x_firstContra,e[1]]});

		this.firstX = this.z_pos[0][0];
		this.lastX = this.z_pos[this.z_pos.length-1][0];
		this.calc = (x,acuracy) => {
			// if(x<this.firstX || x>this.lastX) return 0;
			x = (x-this.firstX)/1000;
			acuracy = !acuracy? 0 : acuracy;
			var raw = this.round((this.A*x**2+this.B*x+this.C)*1000,acuracy);

			return raw > 0? raw:0;
		}
	}
}

module.exports = module_hor;