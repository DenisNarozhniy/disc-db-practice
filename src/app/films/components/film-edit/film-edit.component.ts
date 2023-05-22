import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Subject, takeUntil} from "rxjs";
import { Film } from "src/app/shared/services/films-service/films.interfaces";
import { PeopleService } from "src/app/shared/services/people-service/people.service";
import { FilmGenres, Languages, TranslationTypes } from "src/assets/export-variables.const";
import { getNewUUID, getStrFromDate } from "src/assets/utils.functions";

@Component({
    selector: "film-edit",
    templateUrl: "./film-edit.component.html",
    styleUrls: ["./film-edit.component.scss"]
})

export class FilmEditComponent implements OnInit, OnDestroy {

    private readonly unsubscribe: Subject<void> = new Subject();
    public onSave = new Subject<Film>();
    public mainForm: FormGroup;
    public genres = [];
    public actors = [];
    public directors = [];
    public languages = [];
    public translationTypes = [];
    public genresSelectSettings: IDropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'text',
        allowSearchFilter: true,
        enableCheckAll: false
    };
    public actorsSelectSettings: IDropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'text',
        allowSearchFilter: true
    };
    public languageSelectSettings: IDropdownSettings = {
        singleSelection: true,
        idField: 'id',
        textField: 'text',
        allowSearchFilter: true
    };
    public bsConfig = {
        isAnimated: true, 
        dateInputFormat: 'DD-MM-YYYY',
        adaptivePosition: true
    }
    public film;


    constructor(
        private peopleService: PeopleService,
        private readonly fb: FormBuilder,
        private readonly modalRef: BsModalRef,
        ) {
    }

    ngOnInit(): void {
        this.mainForm = this.fb.group({
            id: this.fb.control(getNewUUID()),
            name: this.fb.control('', [Validators.required]),
            imgUrl: this.fb.control('', []),
            synopsis: this.fb.control('', []),
            date: this.fb.control('', []),
            minutes: this.fb.control(60, []),
            originalLanguage: this.fb.control('', []),
            translateType: this.fb.control('', []),
            translatedLanguage: this.fb.control('', []),
            director: this.fb.control('', []),
            genres: this.fb.control([], []),
            actors: this.fb.control([], []),
        })

        if(this.film) this.mainForm.patchValue(this.film);
        this.peopleService.getPeople()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((people) => {
                this.actors = people
                    .filter((p:any) => p.profession === 'Actor')
                    .map((p:any) => {return { id: p.id, text: p.name }})
                this.directors = people
                    .filter((p:any) => p.profession === 'Director')
                    .map((p:any) => {return { id: p.id, text: p.name }})
            })
        this.genres = FilmGenres.map(g => {return { id: g, text: g }});
        this.languages = Languages;
        this.translationTypes = TranslationTypes;
    }

    save() {        
        if(this.mainForm.invalid) return

        const formValue = this.mainForm.value;
        const film: Film = {
            id: formValue.id,
            name: formValue.name,
            imgUrl: formValue.imgUrl,
            minutes: formValue.minutes,
            synopsis: formValue.synopsis,
            originalLanguage: formValue.originalLanguage?.[0]?.id ?? '',
            translateType: formValue.translateType?.[0]?.id ?? '',
            translatedLanguage: formValue.translatedLanguage?.[0]?.id ?? '',
            director: formValue.director?.[0]?.id ?? '',
            genres: formValue.genres.map(g => { return g.id }),
            actors: formValue.actors.map(g => { return g.id }),
            date: getStrFromDate(formValue.date)
        };
        
        this.onSave.next(film);
        this.onSave.complete();
        this.close();
    }

    close() {
        this.modalRef.hide()
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
