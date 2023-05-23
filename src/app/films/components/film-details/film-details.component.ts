import { Component, HostListener, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { Observable, Subject, filter, takeUntil} from "rxjs";
import { Film } from "src/app/shared/services/films-service/films.interfaces";
import { FilmsService } from "src/app/shared/services/films-service/films.service";
import { Languages } from "src/assets/export-variables.const";
import { FILM, FILM_PROVIDERS } from "../../providers/film.providers";
import { FilmEditComponent } from "../film-edit/film-edit.component";
import { ConfirmComponent } from "src/app/shared/confirm/confirm.component";
import { Router } from "@angular/router";
import { PeopleService } from "src/app/shared/services/people-service/people.service";
import { ActorCarouselItemComponent } from "./actor-carousel-item/actor-carousel-item.component";

@Component({
    selector: "film-details",
    templateUrl: "./film-details.component.html",
    styleUrls: ["./film-details.component.scss"],
    providers: [FILM_PROVIDERS]
})

export class FilmDetailsComponent implements OnInit, OnDestroy {

    private readonly unsubscribe: Subject<void> = new Subject();
    @ViewChild('director') directorComp: ActorCarouselItemComponent;
    public innerWidth: any;

    public genres = [];
    public people = [];
    public languages = [];
    public translationTypes = [];
    public film:Film = {};
    public firstLine = '';
    public secondLine = '';

    @HostListener('window:resize', ['$event'])
        onResize(event) {
            this.innerWidth = window.innerWidth;
        }

    get isTablet() {
        return this.innerWidth < 1200;
    }

    constructor(
        @Inject(FILM) readonly film$: Observable<Film>,
        private filmsService: FilmsService,
        private peopleService: PeopleService,
        private modalService: BsModalService,
        private router: Router
        ) {
    }

    setFilmData(film:Film) {
        this.film = film;

        this.firstLine = '';
        this.secondLine = '';

        if(film.date) 
            this.firstLine += film.date + ' / ';

        if(film.genres.length) 
            this.firstLine += film.genres.join(', ') + ' / ';
        
        const hours = Math.floor(film.minutes / 60);
        this.firstLine += `${hours} h ${film.minutes - hours * 60} m`;
        

        if(film.originalLanguage) 
            this.secondLine += 'Original: ' + Languages.find(l => l.id === film.originalLanguage).text  + ' / ';

        if(film.translateType) 
            this.secondLine += film.translateType + ' / ';

        if(film.translatedLanguage) 
            this.secondLine += 'Traslated: ' + Languages.find(l => l.id === film.translatedLanguage).text;

        if(this.directorComp) {
            setTimeout(() => {
                this.directorComp.setPersonDetails();
            }, 0)
        }
    }

    ngOnInit(): void {
        this.innerWidth = window.innerWidth;

        this.peopleService.getPeople()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((people) => {
                this.people = people;
            })
        this.film$
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(film => this.setFilmData(film))
    }

    editFilm() {

        const dirId = this.film.director;
        const director = dirId ?  [{text: this.people.find(a => a.id === dirId).name, id: dirId}] : [];

        const filmInstance = {
            ...this.film,
            genres: this.film.genres.map(g => {return { id: g, text: g }}),
            director: director,
            actors: this.film.actors.map((g:any) => {return { id: g, text: this.people.find(a => a.id === g).name }}),
        }

        if(this.film.originalLanguage) {
            filmInstance['originalLanguage'] = [Languages.find(l => l.id === this.film.originalLanguage)] as any
        }
        if(this.film.translatedLanguage) {
            filmInstance['translatedLanguage'] = [Languages.find(l => l.id === this.film.translatedLanguage)] as any
        }
        if(this.film.date) {
            filmInstance['date'] = new Date(this.film.date) as any
        }
        if(this.film.translateType) {
            filmInstance['translateType'] = [{text: this.film.translateType, id: this.film.translateType}] as any
        }

        const modalRef = this.modalService.show(FilmEditComponent, {
            initialState: {
                film: filmInstance
            },
            class: "modal-dialog-centered modal-xl"
        })

        modalRef.content.onSave
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((film => {
                this.filmsService.updateFilm(film);
                this.setFilmData(film);
            }))
    }

    goBack() {
        this.router.navigate(["/films"]);
    }

    deleteFilm() {
        const modalRef = this.modalService.show(ConfirmComponent, {
            initialState: {message: 'Are you sure you want to delete this film?'},
            class: "modal-dialog-centered modal-lg"
        })

        modalRef.content.onSave
            .pipe(takeUntil(this.unsubscribe), filter(s => s))
            .subscribe(_ => {
                this.filmsService.deleteFilm(this.film);
                this.router.navigate(["/films"]);
            })
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
