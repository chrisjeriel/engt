import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit {

  constructor() { }

  @Input() label:string = "X";
  @Input() labelTop:string = "*T";
  @Input() labelEnd:string = "*E";
  @Input() labelTopEnd:string = "*TE";
  @Input() isTop:boolean = false;
  @Input() isEnd:boolean = false;
  @Input() isBottom:boolean = false;


  ngOnInit() {
  }

}
