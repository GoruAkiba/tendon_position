
/**
 * [constructor description]
 * @param  {[class]} options.ten1  	[description]
 * @param  {[class]} options.ten2  	[description]
 * @param  {[double]} options.limit [height's limit of tendon area | bottom flange thickness + corner]
 * @param  {[double]} options.dia   [raw tendon diameter]
 * @return {[class]}               	[...]
 */
class module_contra{
	constructor({ten1, ten2, limit, dia}){

		/**
		 * [check if circles overlaping]
		 * @param  {[double]} options.x1 [coordinate x1]
		 * @param  {[double]} options.y1 [coordinate y1]
		 * @param  {[double]} options.r1 [st circle radius]
		 * @param  {[double]} options.x2 [coordinate x2]
		 * @param  {[double]} options.y2 [coordinate y2]
		 * @param  {[double]} options.r2 [nd circle radius]
		 * @return {[bolean]}            [control if circles overlaping]
		 */
		this.ccr = ({x1, y1, r1,x2, y2, r2}) => {
			// pytagorean teoream
			var z = Math.sqrt((x1-x2)**2+(y1-y2)**2);
			return z < r1+r2;
		}

		/**
		 * [list array of each tendon coordinate]
		 * @type {array}
		 */
		this.ten1_pos = ten1.y_pos;
		this.ten2_pos = ten2.y_pos;

		/**
		 * [radius + clearance requirement govern by VSL brochure]
		 * @type {[double]}
		 */
		this.req_r = (dia*0.7+dia)/2;

		/**
		 * [list array of contra coordinate]
		 * @type {Array}
		 */
		this.contra = this.ten1_pos.filter((e,i)=>{
			if(e[1] < limit){
				var coor_1 = e,
					coor_2 = this.ten2_pos[i],
					opt = {
						x1:0,
						y1:coor_1[1],
						x2:0,
						y2:coor_2[1],
						r2:this.req_r,
						r1:this.req_r
					};

				return this.ccr(opt);
			}
		});

		/**
		 * [first of x_coordinate starting contra each other]
		 * @type {double}
		 */
		this.x_firstContra = this.contra[0]? this.contra[0][0] : null;

		/**
		 * [contra_status]
		 * @type {bolean}
		 */
		this.contra_status = this.contra.length? true : false;


	}

}

module.exports = module_contra;