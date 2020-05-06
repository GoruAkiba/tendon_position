

class tendon_pos{
	constructor( { hEdge, hMid, z_edge, z_mid, H, anchor_length, span, acuracy}){
		// init
		span = !span ? 1000 : span;
		acuracy = !acuracy ? 0 : acuracy;

		// calculating zEdge & zMid
		this.zEdge = H - hEdge;
		this.zMid = H - hMid;

		// calc A, B, C
		this.A = (this.zMid - this.zEdge)/(0.5*anchor_length)**2*1000;
		this.B = -this.A * (anchor_length/1000);
		this.C = hEdge/1000;

		// calc Z along anchor_length
		this.y_pos = [];

		this.Zi = ({x,A,B,C,acuracy}) => {
			x = x/1000
			return [x*span,this.round((A*x**2+B*x+C)*1000,acuracy)] 
		}

		this.round = (a,b) => {
			let rn = 10**b;
			return Math.round(a*rn)/rn
		};

		this.verticalAlignment = hEdge !== hMid? true:false;
		this.horisontalAlignment = z_edge !== z_mid? true:false; 

		// iteration for each x along anchor_length
		for(var i =0; i <= Math.round(anchor_length/span); i++){
			var x = i == Math.round(anchor_length/span) ? anchor_length : i*span;
			var opt = {
				x :x,
				A : this.A,
				B : this.B,
				C : this.C,
				acuracy : acuracy
			}
			this.y_pos.push(this.Zi(opt));
		};

		this.calc = (x,acuracy)=>{
			acuracy = !acuracy? 0 : acuracy;
			var raw = this.Zi({x:x,A:this.A,B:this.B,C:this.C,acuracy})[1];
			return raw > 0? raw: 0;
		}	

	}

}

module.exports =tendon_pos; 

// const { hEdge, hMid, H, anchor_length, span, acuracy} = require("./data.json")
// var t01 = new tendon_pos({ hEdge, hMid, H, anchor_length, span, acuracy});

// console.log(t01.y_pos);

