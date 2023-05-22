import {FilmDetailsComponent} from './components/film-details/film-details.component';
import {FilmsComponent} from './components/films-component/films.component';
import {filmsRoutesNames} from './films.route.names';

export const filmsRoutes = [
    {
        path: filmsRoutesNames.Films,
        component: FilmsComponent
    },
    {
        path: filmsRoutesNames.Details,
        component: FilmDetailsComponent
    },
];
