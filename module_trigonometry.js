class trigonometry {

	static  sind (d) {
	  return Math.sin(Math.PI*d/180.0); 
	}

	static cosd (d) {
	  return Math.cos(Math.PI*d/180.0); 
	}

	static tand (d) {
	  return Math.tan(Math.PI*d/180.0); 
	}

	static toRad (d){
		return d*Math.PI/180;
	}

	static toDeg (r){
		return r*180/Math.PI;
	}

}

module.exports = trigonometry;