import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {Observable, Subject, concatMap, filter, takeUntil} from "rxjs";
import { FilmsService } from "src/app/shared/services/films-service/films.service";
import { PeopleEditComponent } from "../people-edit/people-edit.component";
import { ConfirmComponent } from "src/app/shared/confirm/confirm.component";
import { Router } from "@angular/router";
import { Person } from "src/app/shared/services/people-service/person.interfaces";
import { PeopleService } from "src/app/shared/services/people-service/people.service";
import { PERSON, PERSON_PROVIDERS } from "../../providers/people.providers";
import { BsModalService } from "ngx-bootstrap/modal";

@Component({
    selector: "people-details",
    templateUrl: "./people-details.component.html",
    styleUrls: ["./people-details.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PERSON_PROVIDERS],
})

export class PeopleDetailsComponent implements OnInit, OnDestroy {

    private readonly unsubscribe: Subject<void> = new Subject();
    public actorFilms = [];
    public person: Person = {};

    constructor(
        @Inject(PERSON) readonly person$: Observable<Person>,
        private peopleService: PeopleService,
        private filmsService: FilmsService,
        private modalService: BsModalService,
        private router: Router,
        private readonly cd: ChangeDetectorRef
        ) {
    }

    setPersonData(person:Person) {
        this.person = person;
        this.cd.detectChanges();
    }

    ngOnInit(): void {
        this.person$
            .pipe(
                takeUntil(this.unsubscribe),
                concatMap(person => {
                    this.setPersonData(person)
                    return this.filmsService.getFilms()
                })
                )
            .subscribe(films => {
                this.actorFilms = films.filter((f:any) => f.actors.includes(this.person.id));
                this.actorFilms = [...this.actorFilms, ...films.filter((f:any) => f.director === this.person.id)];
                this.cd.detectChanges()
            })
    }

    editPerson() {

        const personInstance = {
            ...this.person,
            profession: [{text: this.person.profession, id: this.person.profession}] as any
        }

        const modalRef = this.modalService.show(PeopleEditComponent, {
            initialState: {
                person: personInstance
            },
            class: "modal-dialog-centered modal-xl"
        })

        modalRef.content.onSave
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((person => {
                this.peopleService.updatePerson(person);
                this.setPersonData(person);
            }))
    }

    goBack() {
        this.router.navigate(["/people"]);
    }

    deletePerson() {
        const modalRef = this.modalService.show(ConfirmComponent, {
            initialState: {message: 'Are you sure you want to delete this person from DB?'},
            class: "modal-dialog-centered modal-lg"
        })

        modalRef.content.onSave
            .pipe(takeUntil(this.unsubscribe), filter(s => s))
            .subscribe(_ => {
                this.peopleService.deletePerson(this.person);
                this.router.navigate(["/people"]);
            })
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
