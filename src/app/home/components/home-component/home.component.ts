import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, takeUntil, tap } from "rxjs";
import { FilmsService } from "src/app/shared/services/films-service/films.service";
import { PeopleService } from "src/app/shared/services/people-service/people.service";

@Component({
    selector: "home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})

export class HomeComponent implements OnInit, OnDestroy {

    private readonly unsubscribe: Subject<void> = new Subject();

    public films = [];
    public people = [];

    constructor(
        private filmsService: FilmsService,
        private peopleService: PeopleService,
        private router: Router
        ) {
    }

    ngOnInit(): void {
        const count = 6
        this.filmsService.getFilms()
            .pipe(
                takeUntil(this.unsubscribe),
                tap((films) => {
                    this.films = films.sort(() => 0.5 - Math.random()).slice(0, count);
                })
            ).subscribe()

        this.peopleService.getPeople()
            .pipe(
                takeUntil(this.unsubscribe),
                tap((people) => {
                    this.people = people.sort(() => 0.5 - Math.random()).slice(0, count);
                })
            ).subscribe()
    }

    truncName(name:string) {
        if(name.length < 30) return name
        else return (name.substring(0, 30) + '...')
    }

    openPersonDetails(person) {
        this.router.navigate(['people', person.id, 'details'])
    }

    openFilmDetails(film) {
        this.router.navigate(['films', film.id, 'details'])
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
