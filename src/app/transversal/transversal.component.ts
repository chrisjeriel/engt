import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transversal',
  templateUrl: './transversal.component.html',
  styleUrls: ['./transversal.component.css']
})
export class TransversalComponent implements OnInit {

  constructor() { }

  nStorey:number = 3;
  nsHeight:number = 3200;
  nColumn:number = 6;
  ncSpan:number = 5000;

  
  beamB: number = 500;
  beamH: number = 400;
  colB: number = 400;
  colH: number = 400;
  wLKN: number = 5.48;
  wRKN: number = 5.57;

  stoHeightArr: any = [];
  sobArr: any = [];
  socArr: any = [];
  columnS:any = [];
  windLKN: any = [];
  windRKN: any = [];
  stoStiffs: any = [];
  colStiffs: any = [];
  gfArr: any = [];
  cfArr: any = [];
  cmfSubArr: any = [];
  floorSpecs:any = [];
  gfmArr:any = [];
  cfmArr:any = [];

  dSpec:any = [];
  stoArr:any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ'];

  ngOnInit() {
  	this.generateDiagram();
  }

  generateDiagram() {
  	this.dSpec = [];
  	this.stoHeightArr = [];
	this.sobArr = [];
	this.socArr = [];
	this.columnS = [];
	this.windLKN = [];
  	this.windRKN = [];

	// Column Span
	for (var i = 1; i <= this.nColumn; i++) {
  		this.columnS.push({span:i, width:this.ncSpan}); /*Initial Value*/
  	}

  	// Beam | Col (B&H) && Storey Heights
  	for (var i = this.nStorey; i >= 1; i--) {
  		this.stoHeightArr.push({floor: i, height: this.nsHeight});
  		this.sobArr.push({level: i, beamB: this.beamB, beamH: this.beamH});
  		this.socArr.push({level: i, colB: this.colB, colH: this.colH});
  		this.windLKN.push({level: i, wKN: this.wLKN});
  		this.windRKN.push({level: i, wKN: this.wRKN});
  		
  		this.colB = this.colB + 50;
  		this.colH = this.colH + 50;
  	}

  	this.colB = this.colB - 50;
  	this.colH = this.colH - 50;

  	// Floor Specs
  	for (var y = 0; y < this.nStorey+1; y++) {
  		var floor:any = [];
  		for (var x = 0; x < this.nColumn+1; x++) {
  			floor.push((y+1)+this.stoArr[x]);
  		}
  		this.dSpec.push(floor);
  	}

  	this.dSpec = this.dSpec.reverse();

  	this.compute();
  }

  checkValues() {

  }

  compute() {
  	this.stoStiffs = [];
  	this.colStiffs = [];
  	this.gfArr = [];
  	this.cfArr = [];
  	this.cmfSubArr = [];
  	this.floorSpecs = [];
  	this.gfmArr = [];
	this.cfmArr = [];

  	// Stiffs
  	for (let soc of this.socArr) {
  		var n:any = 0;
  		for (let sto of this.stoHeightArr) {
  			if (soc.level == sto.floor) {
  				n = sto.height;
  			}
  		}
  		this.stoStiffs.push({level: soc.level, k: Math.round(((((1/12)*soc.colB*(Math.pow(soc.colH,3)))/n)/1000))});
  	}

  	for (let sob of this.sobArr) {

  		var lev = [];
  		for (let col of this.columnS) {

  			var n:any = 0;
  			n = ((((1/12)*(sob.beamB)*(Math.pow(sob.beamH,3)))/col.width)/1000).toFixed(2);
  			lev.push({level: sob.level, span: col.span, l: col.width, beamB: sob.beamB, beamH: sob.beamH, k: Math.round(n)});
  		}
  		this.colStiffs.push(lev);
  	}





  	// GirderFactor
  	var gfSpec:any = [];

  	for (let spec of this.dSpec) {
  		gfSpec.push(spec);
  	}

  	gfSpec.pop();
  	gfSpec = gfSpec.reverse();

  	var level = 0;
  	for (let gs of gfSpec) {
  		var gfArrLevel = [];
  		level++;
  		var levelK = 0;
  		var levelUK = 0;

  		for (let cs of this.stoStiffs) {
  			if (level == cs.level) {
  				levelK = cs.k;
  				for (let cx of this.stoStiffs) {
  					if (level+1 == cx.level) {
  						levelUK = cx.k;
  					}
  				}
  			}
  		}

  		var cstiff = [];
  		for (let cs of this.colStiffs) {
			if (cs[0].level == level) {
				cstiff = cs;
			}
		}

  		for (var i = 0; i < gs.length-1; i++) {
  			
  			if (i == 0) {
  				var gf = 0;
  				gf = (levelK+levelUK)/(levelK+levelUK+cstiff[i].k);
  				
  				var gf2 = 0;
  				gf2 = (levelK+levelUK)/(levelK+levelUK+cstiff[i].k+cstiff[i+1].k);

  				gfArrLevel.push({level: level, dir: 'f', span: cstiff[i].span, col: gs[i]+'-'+gs[i+1], gf: gf, dgf: gf+(gf2/2), gmf: Math.round((gf+(gf2/2))*cstiff[i].k), gmfd: (gf+(gf2/2))*cstiff[i].k }); 			/*ck1: levelK, ck2: levelUK, k:cstiff[i].k, */
  				gfArrLevel.push({level: level, dir: 'b', span: cstiff[i].span, col: gs[i+1]+'-'+gs[i], gf: gf2, dgf: gf2+(gf/2), gmf: Math.round((gf2+(gf/2))*cstiff[i].k), gmfd: (gf2+(gf/2))*cstiff[i].k }); 			/*ck1: levelK, ck2: levelUK, k:cstiff[i].k, k2:cstiff[i+1].k,*/
  			} else if (i != 0 && i != gs.length-2) {
  				var gf = 0;
  				gf = (levelK+levelUK)/(levelK+levelUK+cstiff[i-1].k+cstiff[i].k);
  				
  				var gf2 = 0;
  				gf2 = (levelK+levelUK)/(levelK+levelUK+cstiff[i].k+cstiff[i+1].k);

  				gfArrLevel.push({level: level, dir: 'f', span: cstiff[i].span, col: gs[i]+'-'+gs[i+1], gf: gf, dgf: gf+(gf2/2), gmf: Math.round((gf+(gf2/2))*cstiff[i].k), gmfd: (gf+(gf2/2))*cstiff[i].k }); 			/*ck1: levelK, ck2: levelUK, k:cstiff[i-1].k, k2:cstiff[i].k*/
  				gfArrLevel.push({level: level, dir: 'b', span: cstiff[i].span, col: gs[i+1]+'-'+gs[i], gf: gf2, dgf: gf2+(gf/2), gmf: Math.round((gf2+(gf/2))*cstiff[i].k), gmfd: (gf2+(gf/2))*cstiff[i].k }); 			/*ck1: levelK, ck2: levelUK, k:cstiff[i].k, k2:cstiff[i+1].k*/
  			} else {
  				var gf = 0;
  				gf = (levelK+levelUK)/(levelK+levelUK+cstiff[i-1].k+cstiff[i].k);
  				
  				var gf2 = 0;
  				gf2 = (levelK+levelUK)/(levelK+levelUK+cstiff[i].k);

  				gfArrLevel.push({level: level, dir: 'f', span: cstiff[i].span, col: gs[i]+'-'+gs[i+1], gf: gf, dgf: gf+(gf2/2), gmf: Math.round((gf+(gf2/2))*cstiff[i].k), gmfd: (gf+(gf2/2))*cstiff[i].k });			/*ck1: levelK, ck2: levelUK, k:cstiff[i-1].k, k2:cstiff[i].k*/
  				gfArrLevel.push({level: level, dir: 'b', span: cstiff[i].span, col: gs[i+1]+'-'+gs[i], gf: gf2, dgf: gf2+(gf/2), gmf: Math.round((gf2+(gf/2))*cstiff[i].k), gmfd: (gf2+(gf/2))*cstiff[i].k }); 			/*ck1: levelK, ck2: levelUK, k:cstiff[i].k*/
  			}
  			
  		}
  		this.gfArr.push(gfArrLevel);
  	}

  	// End of GirderFactor

  	// Column Factor
  	var cfSpec:any = [];
  	for (let spec of this.dSpec) {
  		cfSpec.push(spec);
  	}

  	cfSpec = cfSpec.reverse();

  	level = 0;

  	for (var i = 0; i < cfSpec.length; i++) {
  		var cfArrLevel = [];
  		level++;

  		if (i != cfSpec.length-1) {
  			var gfLevel:any;
  			var prevGflevel:any;
  			


  			if (level == 1) {
  				
	  			for (var g = 0; g < this.gfArr.length; g++) {
	  				if (level == this.gfArr[g][0].level) {
	  					gfLevel = this.gfArr[g];
	  				}
	  			}

  				var icf = 0;
	  			var span = 0;
	  			var pole = 0;
	  			for (let cs of cfSpec[i]) {
	  				var levS = 0;
	  				pole++;

	  				for (let stos of this.stoStiffs) {
						if (level == stos.level) {
							levS = stos.k;
						}
					}

	  				
					if (icf == 0) {
	  					var sbh = 0;
	  					
	  					var cf1 = 0;
	  					var cf2 = 0;
	  					var dcf1 = 0;
	  					var dcf2 = 0;
	  					span++;

	  					for (let gfl of gfLevel) {
	  						if (gfl.level == level && gfl.span == span && gfl.dir == 'f') {
	  							sbh = gfl.gf;
	  						}
	  					}

	  					

	  					cf1 = 1;
	  					cf2 = (1-sbh);
	  					dcf1 = cf1+(cf2/2);
	  					dcf2 = cf2+(cf1/2);

	  					cfArrLevel.push({level: level, pole: pole, dir: 'f', col: cs+'-'+cfSpec[i+1][icf], cf: cf1, dcf: dcf1, cmf: dcf1*levS});
		  				cfArrLevel.push({level: level, pole: pole, dir: 'b', col: cfSpec[i+1][icf]+'-'+cs, cf: cf2, dcf: dcf2, cmf: dcf2*levS});
	  				} else {
	  					var sbh = 0;

	  					var cf1 = 0;
	  					var cf2 = 0;
	  					var dcf1 = 0;
	  					var dcf2 = 0;
	  					span++;

	  					for (let gfl of gfLevel) {
	  						if (gfl.level == level && gfl.span == span-1 && gfl.dir == 'b') {
	  							sbh = gfl.gf;
	  						}
	  					}

	  					cf1 = 1;
	  					cf2 = (1-sbh);
	  					dcf1 = cf1+(cf2/2);
	  					dcf2 = cf2+(cf1/2);

	  					cfArrLevel.push({level: level, pole: pole, dir: 'f', col: cs+'-'+cfSpec[i+1][icf], cf: cf1, dcf: dcf1, cmf: dcf1*levS});
		  				cfArrLevel.push({level: level, pole: pole, dir: 'b', col: cfSpec[i+1][icf]+'-'+cs, cf: cf2, dcf: dcf2, cmf: dcf2*levS});
	  				}

	  				icf++;
		  		}
		  	} else {
				var prevCf:any = [];
				for (let cfp of this.cfArr) {
					if (cfp[0].level == level-1) {
						prevCf = cfp;
					}
				}

				for (var g = 0; g < this.gfArr.length; g++) {
	  				if (level == this.gfArr[g][0].level) {
	  					gfLevel = this.gfArr[g];
	  					prevGflevel = this.gfArr[g-1];
	  				}
	  			}

				var icf = 0;
	  			var span = 0;
	  			var pole = 0;
	  			for (let cs of cfSpec[i]) {
	  				var levS = 0;
	  				pole++;

	  				for (let stos of this.stoStiffs) {
						if (level == stos.level) {
							levS = stos.k;
						}
					}

	  				
					if (icf == 0) {
	  					var sbh = 0;
	  					var psbh = 0;
	  					
	  					var cf1 = 0;
	  					var cf2 = 0;
	  					var dcf1 = 0;
	  					var dcf2 = 0;
	  					span++;

	  					for (let gfl of gfLevel) {
	  						if (gfl.level == level && gfl.span == span && gfl.dir == 'f') {
	  							sbh = gfl.gf;
	  						}
	  					}

	  					for (let gfl of prevGflevel) {
	  						if (gfl.span == span && gfl.dir == 'f') {
	  							psbh = gfl.gf;
	  						}
	  					}

	  					

	  					cf1 = 1-psbh;
	  					cf2 = 1-sbh;
	  					dcf1 = cf1+(cf2/2);
	  					dcf2 = cf2+(cf1/2);

	  					cfArrLevel.push({level: level, pole: pole, dir: 'f', col: cs+'-'+cfSpec[i+1][icf], cf: cf1, dcf: dcf1, cmf: dcf1*levS});
		  				cfArrLevel.push({level: level, pole: pole, dir: 'b', col: cfSpec[i+1][icf]+'-'+cs, cf: cf2, dcf: dcf2, cmf: dcf2*levS});
	  				} else {
	  					var sbh = 0;

	  					var cf1 = 0;
	  					var cf2 = 0;
	  					var dcf1 = 0;
	  					var dcf2 = 0;
	  					span++;

	  					for (let gfl of gfLevel) {
	  						if (gfl.level == level && gfl.span == span-1 && gfl.dir == 'b') {
	  							sbh = gfl.gf;
	  						}
	  					}

	  					for (let gfl of prevGflevel) {
	  						if (gfl.span == span-1 && gfl.dir == 'b') {
	  							psbh = gfl.gf;
	  						}
	  					}

	  					cf1 = 1-psbh;
	  					cf2 = 1-sbh;
	  					dcf1 = cf1+(cf2/2);
	  					dcf2 = cf2+(cf1/2);

	  					cfArrLevel.push({level: level, pole: pole, dir: 'f', col: cs+'-'+cfSpec[i+1][icf], cf: cf1, dcf: dcf1, cmf: dcf1*levS});
		  				cfArrLevel.push({level: level, pole: pole, dir: 'b', col: cfSpec[i+1][icf]+'-'+cs, cf: cf2, dcf: dcf2, cmf: dcf2*levS});
	  				}

	  				icf++;
		  		}
		  	}

	  		this.cfArr.push(cfArrLevel);
  		}
  		

  		
  	}


  	//Submations
  	for (let cfa of this.cfArr) {
  		var subm = 0;
 		var x = 0;
  		for (let cf of cfa) {
  			x = cf.level;
  			subm = subm + cf.cmf;
  		}

  		this.cmfSubArr.push({level: x, cfs: subm});
  	}

  	//Floor Specs
  	for (let sto of this.stoHeightArr) {
  		var windSum:number = 0;
  		var scmf:number = 0;

  		for (let lw of this.windLKN) {
  			if (lw.level >= sto.floor) {
  				windSum = windSum + parseFloat(lw.wKN);
  			}
  		}

  		for (let lw of this.windRKN) {
  			if (lw.level >= sto.floor) {
  				windSum = windSum + parseFloat(lw.wKN);
  			}
  		}

  		for (let cmf of this.cmfSubArr) {
  			if (cmf.level == sto.floor) {
  				scmf = cmf.cfs;
  			}
  		}

		this.floorSpecs.push({level: sto.floor, height: sto.height, wKN: windSum, scmf: scmf, n: ((sto.height*windSum)/(scmf*Math.pow(10,3))).toFixed(3)});
	}

	this.floorSpecs = this.floorSpecs.reverse();

	for (var i = 1; i <= this.nStorey; i++) {
		let cfmRow:any = [];
		let mult:any = 0;

		for (let fs of this.floorSpecs) {
			if (i == fs.level) {
				mult = fs.n;
			}
		}

		for (let cf of this.cfArr) {
			for (let c of cf) {
				if (i == c.level) {
					cfmRow.push({ level:c.level, pole: c.pole, col: c.col, dir: c.dir, cmf: c.cmf, fcm: (c.cmf*mult).toFixed(3), fcmd: (c.cmf*mult) });
				}
			}
		}
		this.cfmArr.push(cfmRow);
	}


	for (let gfa of this.gfArr) {
		let gfaRow:any = [];
		let currCfm: any = [];
		let nxtCfm: any = [];

		let currLvl = gfa[0].level;

		for (var i = 0; i < this.cfmArr.length; i++) {

			if (this.cfmArr[i][0].level == currLvl) {
				currCfm = this.cfmArr[i];
				nxtCfm = this.cfmArr[i+1] != undefined ? this.cfmArr[i+1] : [];
			}
			
		}


		var gfi = 0;
		var ix = 0;
		for (let gf of gfa) {
			var currCmb = 0;
			var nxtCmb = 0;
			var final = 0;
			gfi++;

			if (gfi%2!=0) {

				for (let cf of currCfm) {
					if (cf.pole == gf.span && cf.dir == 'b') {
						currCmb = cf.fcmd;
					}
				}

				for (let cf of nxtCfm) {
					if (cf.pole == gf.span && cf.dir == 'f') {
						nxtCmb = cf.fcmd;
					}
				}

				if (gf.span == 1) {
					final = ((currCmb + nxtCmb)/gf.gmfd)*gf.gmfd;

					gfaRow.push({level: gf.level, span: gf.span, dir: gf.dir, col: gf.col, gmf: (final).toFixed(3) });
				} else {

					final = ((currCmb + nxtCmb)/(gf.gmfd + gfa[ix-1].gmfd))*gf.gmfd;

					gfaRow.push({level: gf.level, span: gf.span, dir: gf.dir, col: gf.col, gmf: (final).toFixed(3) });
				}
				
			} else {
				for (let cf of currCfm) {
					if (cf.pole == gf.span+1 && cf.dir == 'b') {
						currCmb = cf.fcmd;
					}
				}

				for (let cf of nxtCfm) {
					if (cf.pole == gf.span+1 && cf.dir == 'f') {
						nxtCmb = cf.fcmd;
					}
				}

				final = ((currCmb + nxtCmb)/(gf.gmfd + (gfa[ix+1] != undefined ? gfa[ix+1].gmfd : 0) ))*gf.gmfd;

				gfaRow.push({level: gf.level, span: gf.span, dir: gf.dir, col: gf.col, gmf: (final).toFixed(3) });
			}
			
			

			ix++;
		}
		this.gfmArr.push(gfaRow);
	}

	console.log("colStiffs");
  	console.log(this.colStiffs);

  }

  trackByFn(index: any, item: any) {
    return index;
  }
}
