import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {filmsRoutes} from './films.routes';
import {FilmsComponent} from './components/films-component/films.component';
import {FilmEditComponent} from './components/film-edit/film-edit.component';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {FilmDetailsComponent} from './components/film-details/film-details.component';
import {ActorCarouselItemComponent} from './components/film-details/actor-carousel-item/actor-carousel-item.component';

@NgModule({
    declarations: [
        FilmsComponent,
        FilmEditComponent,
        FilmDetailsComponent,
        ActorCarouselItemComponent
    ],
    imports: [
        RouterModule.forChild(filmsRoutes),
        SharedModule
    ],
    providers: [
        BsDatepickerConfig
    ]
})
export class FilmsModule {
}
