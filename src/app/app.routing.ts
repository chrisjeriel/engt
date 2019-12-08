import { Routes, RouterModule } from '@angular/router';
import { DiagramComponent } from './diagram/diagram.component';
import { DetailsComponent } from './details/details.component';
import { ComputationsComponent } from './computations/computations.component';
import { TransversalComponent } from './transversal/transversal.component';

const appRoutes: Routes = [
	
	{ path: 'factormethod', component: TransversalComponent },
    { path: '**', redirectTo: 'factormethod' }

];
export const routing = RouterModule.forRoot(appRoutes);