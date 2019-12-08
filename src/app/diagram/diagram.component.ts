import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	this.compute();
  }

  stoArr:any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  nStorey:number = 3;
  nColumn:number = 8;
  spanLength:number = 5.00;
  stoHeight:number = 3.15;
  stoShear:number = 5.50;
  gWidth:number = .3;
  gHeight:number = .45;
  gmoiValue:number = 0.00;
  gbfValue:number = 1.00;

  cWidth:number = .45;
  cHeight:number = .45;
  cmoiValue:number = 0.00;
  cbfValue:number = 1.50;

  columnS:any = [5,5,5,5];
  storeyS:any = [5.2,6,5.5];
  storeyH:any = [3.15,3.15,3.15];

  cStiffness:any = [];
  gStiffness:any = [];

  dSpec:any = [];
  revDSpec:any = [];

  gStiffnessRow: any = [];
  gFactorsRow: any = [];
  colMRow: any = [];

  
  compute() {
  	this.columnS = [];
  	this.storeyS = [];
  	this.storeyH = [];
  	this.dSpec = [];
    this.cStiffness = [];

  	for (var i = 0; i < this.nColumn; i++) {
  		this.columnS.push(this.spanLength); /*Initial Value*/
  	}

  	for (var i = 0; i < this.nStorey; i++) {
  		this.storeyS.push(this.stoShear); /*Initial Value*/
  		this.storeyH.push(this.stoHeight); /*Initial Value*/
  	}

  	for (var y = 0; y < this.nStorey+1; y++) {
  		var floor:any = [];
  		for (var x = 0; x < this.nColumn+1; x++) {
  			floor.push((y+1)+this.stoArr[x]);
  		}
  		this.dSpec.push(floor);
  	}

  	this.dSpec = this.dSpec.reverse();

    this.reCalculate();
  }

  reCalculate() {
    this.cStiffness = [];
    this.gStiffness = [];
    this.gStiffnessRow = [];
    this.gFactorsRow = [];
    this.revDSpec = [];
    this.colMRow = [];

    this.gmoiValue = ((this.gWidth)*(Math.pow(this.gHeight,3))/12);
    this.cmoiValue = ((this.cWidth)*(Math.pow(this.cHeight,3))/12);

    var revStoreyH = [];

    for (var i = this.storeyH.length - 1; i >= 0; i--) {
      revStoreyH.push(this.storeyH[i]);
    }

    // cStiffness Calculation
    for (var i = 0; i <= this.nStorey; i++) {
      if (i==0) {
        this.cStiffness.push(0);
      } else {
        this.cStiffness.push(this.cbfValue / revStoreyH[i-1]);
      }
    }
    // End of cStiffness Calculation

    // gStiffness Calculation
    var revDSpec = [];

    var gSTF = [];

    for (var i = this.dSpec.length - 1; i >= 0; i--) {
      revDSpec.push(this.dSpec[i]);
      this.revDSpec.push(this.dSpec[i]);
    }

    for (var i = 0; i <= this.nStorey; i++) {
      this.gStiffness.push(revDSpec[i]);
    }

    this.gStiffness.forEach( (element:Array<Object>, index) => {
      if (index!=0) {
        var rowStiff = [];
        element.forEach((column, elIndex) => {
          if(elIndex!=(element.length-1)) {
            rowStiff.push({
                                      "column":(element[elIndex]+'-'+element[elIndex+1]),
                                      "stiffNess":(this.gbfValue/this.columnS[elIndex]),
                                      "revColumn":(element[elIndex+1]+'-'+element[elIndex]),
                                      "revStiffNess":(this.gbfValue/this.columnS[elIndex])
                                   });
          }
        });

        this.gStiffnessRow.push(rowStiff);
      }
    });
    // End of gStiffness Calculation


    // GirderFactors Calculation
    this.gStiffness.forEach( (element:Array<Object>, index) => {
        var rowFactors = [];
        element.forEach((column, elIndex) => {
          if (index==0) {
            rowFactors.push({
                              "joint":(element[elIndex]),
                              "csj":0,
                              "gf":0,
                              "cf":1-0
                           });
          } else if (index==(this.gStiffness.length-1)){
            if (elIndex==0) {
              rowFactors.push({
                  "joint":(element[elIndex]),
                  "csj":this.cbfValue/4,
                  "gf":(this.cbfValue/4) / (this.cbfValue/4+this.gStiffnessRow[index-1][elIndex]['stiffNess']),
                  "cf":1-(this.cbfValue/4) / (this.cbfValue/4+this.gStiffnessRow[index-1][elIndex]['stiffNess'])
              });
            } else if (elIndex==(element.length-1)) {
              rowFactors.push({
                  "joint":(element[elIndex]),
                  "csj":this.cbfValue/4,
                  "gf":(this.cbfValue/4) / ((this.cbfValue/4)+this.gStiffnessRow[index-1][elIndex-1]['revStiffNess']),
                  "cf":1-(this.cbfValue/4) / ((this.cbfValue/4)+this.gStiffnessRow[index-1][elIndex-1]['revStiffNess'])
              });
            } else {
              rowFactors.push({
                  "joint":(element[elIndex]),
                  "csj":this.cbfValue/4,
                  "gf":(this.cbfValue/4) / ((this.cbfValue/4)+this.gStiffnessRow[index-1][elIndex]['stiffNess']+this.gStiffnessRow[index-1][elIndex-1]['revStiffNess']),
                  "cf":1-(this.cbfValue/4) / ((this.cbfValue/4)+this.gStiffnessRow[index-1][elIndex]['stiffNess']+this.gStiffnessRow[index-1][elIndex-1]['revStiffNess'])
              });
            }
          } else {
            if (elIndex==0) {
              rowFactors.push({
                  "joint":(element[elIndex]),
                  "csj":this.cbfValue/2,
                  "gf":(this.cbfValue/2) / (this.cbfValue/2+this.gStiffnessRow[index-1][elIndex]['stiffNess']),
                  "cf":1-(this.cbfValue/2) / (this.cbfValue/2+this.gStiffnessRow[index-1][elIndex]['stiffNess'])
              });
            } else if (elIndex==(element.length-1)) {
              rowFactors.push({
                  "joint":(element[elIndex]),
                  "csj":this.cbfValue/2,
                  "gf":(this.cbfValue/2) / (this.cbfValue/2+this.gStiffnessRow[index-1][elIndex-1]['revStiffNess']),
                  "cf":1-(this.cbfValue/2) / (this.cbfValue/2+this.gStiffnessRow[index-1][elIndex-1]['revStiffNess'])
              });
            } else {
              rowFactors.push({
                  "joint":(element[elIndex]),
                  "csj":this.cbfValue/2,
                  "gf":(this.cbfValue/2) / ((this.cbfValue/2)+(this.gStiffnessRow[index-1][elIndex]['stiffNess'])+(this.gStiffnessRow[index-1][elIndex-1]['revStiffNess'])),
                  "cf":1-(this.cbfValue/2) / ((this.cbfValue/2)+(this.gStiffnessRow[index-1][elIndex]['stiffNess'])+(this.gStiffnessRow[index-1][elIndex-1]['revStiffNess']))
              });
            }
          }
        });
        this.gFactorsRow.push(rowFactors);
    });
    // End of GirderFactors Calculation

    // Column Moment Calculation
    this.gStiffness.forEach( (element:Array<Object>, index) => {
      var rowCM:Array<Object> = [];
      element.forEach((column, elIndex) => {
        if (index==(this.gStiffness.length-1)) {

        } else {
          rowCM.push({
                    "gfIdentifier" : this.gStiffness[index][elIndex],
                    "oppIdentifier" : this.gStiffness[index+1][elIndex],
                    "column" : this.gStiffness[index][elIndex]+'-'+this.gStiffness[index+1][elIndex]
                  });
        }
        
      });
      element.forEach((column, elIndex) => {
        if (index==(this.gStiffness.length-1)) {

        } else {
          rowCM.push({
                    "gfIdentifier" : this.gStiffness[index+1][elIndex],
                    "oppIdentifier" : this.gStiffness[index][elIndex],
                    "column" : this.gStiffness[index+1][elIndex]+'-'+this.gStiffness[index][elIndex]
                  });
        }
        
      });
      if (rowCM.length!=0) {
        this.colMRow.push(rowCM);
      }
    });

    this.colMRow.forEach( (element:Array<Object>, index) => {
      element.forEach((column, elIndex) => {
        this.gFactorsRow.forEach( (gfElem:Array<Object>, gfIndex) => {
          gfElem.forEach((gf, gfeIndex) => {
            if (column['gfIdentifier'] == gf['joint']) {
              column['cf'] = gf['cf'];
              return;
            }
          });
        });
      });
    });


    this.colMRow.forEach( (element:Array<Object>, index) => {
      element.forEach((column, elIndex) => {
        this.gFactorsRow.forEach( (gfElem:Array<Object>, gfIndex) => {
          gfElem.forEach((gf, gfeIndex) => {
            if (column['oppIdentifier'] == gf['joint']) {
              column['oppCf'] = gf['cf'];
              return;
            }
          });
        });
      });
    });


    // End of Column Moment Calculation    
  }

  alert() {
    alert("Column Span: " + this.columnS +
    "\nStorey Shear: " + this.storeyS +
    "\nStorey Height: " + this.storeyH);
    console.log("colMRow");
    console.log(this.colMRow);
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  pad(str, num?) {
    if(str === '' || str == null){
      return '';
    }

    return String(str).padStart(num != undefined ? num : 3, '0');
  }

  insertGStiffRow(column, value) {
    this.gStiffnessRow.push({column: column, value: value});
  }
}
