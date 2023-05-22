import { InjectionToken, Provider } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, switchMap } from "rxjs";
import { Film } from "src/app/shared/services/films-service/films.interfaces";
import { FilmsService } from "src/app/shared/services/films-service/films.service";

export const FILM = new InjectionToken<Observable<Film>>(
    'A stream with current film information'
);

export const FILM_PROVIDERS: Provider[] = [
    {
        provide: FILM,
        deps: [ActivatedRoute, FilmsService],
        useFactory: filmFactory,
    }
];

export function filmFactory(
    { params }: ActivatedRoute,
    filmsService: FilmsService
): Observable<Film> {
    return params.pipe(
        switchMap((params) => {
            const id = params['id'];
            return filmsService.getFilmById(id);
        })
    );
}
