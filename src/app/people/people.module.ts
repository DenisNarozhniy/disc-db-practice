import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {PeopleRoutes} from './people.routes';
import {PeopleComponent} from './components/people-component/people.component';
import { PeopleEditComponent } from './components/people-edit/people-edit.component';
import { PeopleDetailsComponent } from './components/people-details/people-details.component';
import { FilmCarouselItemComponent } from './components/people-details/film-carousel-item/film-carousel-item.component';

@NgModule({
    declarations: [
        PeopleComponent,
        PeopleEditComponent,
        PeopleDetailsComponent,
        FilmCarouselItemComponent
    ],
    imports: [
        RouterModule.forChild(PeopleRoutes),
        SharedModule
    ]
})
export class PeopleModule {
}
