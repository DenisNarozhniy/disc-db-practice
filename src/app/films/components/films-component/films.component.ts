import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil, tap } from "rxjs";
import { FilmsService } from "src/app/shared/services/films-service/films.service";
import { FilmGenres } from "src/assets/export-variables.const";
import { BsModalService } from "ngx-bootstrap/modal";
import { FilmEditComponent } from "../film-edit/film-edit.component";
import { ActivatedRoute, Router } from "@angular/router";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: "films",
    templateUrl: "./films.component.html",
    styleUrls: ["./films.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilmsComponent implements OnInit, OnDestroy {

    private readonly unsubscribe: Subject<void> = new Subject();

    public genres = [];
    public films = [];
    public genresSelectSettings: IDropdownSettings = {
        singleSelection: false,
        idField: 'id', textField: 'text',
        allowSearchFilter: true, enableCheckAll: false
    };
    public mainForm: FormGroup;

    constructor(
        private filmsService: FilmsService,
        private modalService: BsModalService,
        private readonly cd: ChangeDetectorRef,
        private router: Router,
        private readonly route: ActivatedRoute,
        private readonly fb: FormBuilder
        ) {
    }

    ngOnInit(): void {
        this.mainForm = this.fb.group({
            name: this.fb.control(''),
            genres: this.fb.control([])
        })

        this.genres = FilmGenres.map(g => {return { id: g, text: g }});
        this.filmsService.getFilms()
            .pipe(
                takeUntil(this.unsubscribe),
                tap(data => {
                    this.films = data;
                    this.cd.detectChanges();
                }) 
            ).subscribe();
    }

    truncName(name:string) {
        if(name.length < 30) return name
        else return (name.substring(0, 30) + '...')
    }

    openDetails(film) {
        this.router.navigate([film.id, 'details'], {relativeTo: this.route})
    }

    searchFilms() {
        const formValue = this.mainForm.value;
        const params = {
            name: formValue.name,
            genres: formValue.genres.map(g => {return g.id})
        };

        if(Object.keys(params).length) {
            this.filmsService.getFilms(params)
                .pipe(
                    takeUntil(this.unsubscribe),
                    tap(data => {
                        this.films = data;
                        this.cd.detectChanges();
                    })
                ).subscribe()
        }
    }

    addFilm() {
        const modalRef = this.modalService.show(FilmEditComponent, {
            class: 'modal-dialog-centered modal-xl'
        })

        modalRef.content.onSave
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((film => {
                this.filmsService.addFilm(film);
            }))
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
