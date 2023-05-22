import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {HomeRoutes} from './home.routes';
import {HomeComponent} from './components/home-component/home.component';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        RouterModule.forChild(HomeRoutes),
        SharedModule
    ]
})
export class HomeModule {
}
