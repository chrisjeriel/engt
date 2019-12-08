import { Routes, RouterModule } from '@angular/router';
import { DiagramComponent } from './diagram/diagram.component';
import { DetailsComponent } from './details/details.component';
import { ComputationsComponent } from './computations/computations.component';
import { TransversalComponent } from './transversal/transversal.component';

const appRoutes: Routes = [
	
	{ path: '', component: DetailsComponent },
	{ path: 'factormethod', component: TransversalComponent },
    { path: '**', redirectTo: '' }

];
export const routing = RouterModule.forRoot(appRoutes);