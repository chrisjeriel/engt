import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BoxComponent } from './box/box.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { routing } from './app.routing';
import { DiagramComponent } from './diagram/diagram.component';
import { DetailsComponent } from './details/details.component';
import { ComputationsComponent } from './computations/computations.component';
import { FormsModule } from '@angular/forms';
import { ColumnComponent } from './column/column.component';
import { NgxMaskModule } from 'ngx-mask';
import { TransversalComponent } from './transversal/transversal.component';

@NgModule({
  declarations: [
    AppComponent,
    BoxComponent,
    DiagramComponent,
    DetailsComponent,
    ComputationsComponent,
    ColumnComponent,
    TransversalComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AngularFontAwesomeModule,
    routing,
    FormsModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
