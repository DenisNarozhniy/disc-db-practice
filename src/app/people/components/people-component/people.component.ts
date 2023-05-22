import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { Subject, takeUntil, tap} from "rxjs";
import { Professions } from "src/assets/export-variables.const";
import { PeopleEditComponent } from "../people-edit/people-edit.component";
import { PeopleService } from "src/app/shared/services/people-service/people.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { IDropdownSettings } from "ng-multiselect-dropdown";

@Component({
    selector: "people",
    templateUrl: "./people.component.html",
    styleUrls: ["./people.component.scss"]
})

export class PeopleComponent implements OnInit, OnDestroy {

    private readonly unsubscribe: Subject<void> = new Subject();

    public professions = [];
    public people = [];
    public mainForm: FormGroup;
    public professionSelectSettings: IDropdownSettings = {
        singleSelection: true,
        idField: 'id',
        textField: 'text',
        allowSearchFilter: true
    };
    constructor(
        private peopleService: PeopleService,
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
            profession: this.fb.control([])
        })

        this.professions = Professions.map(p => {return { id: p, text: p }});
        this.peopleService.getPeople()
            .pipe(
                takeUntil(this.unsubscribe),
                tap(data => {
                    this.people = data;
                    this.cd.detectChanges();
                })
            ).subscribe()
    }

    openDetails(film) {
        this.router.navigate([film.id, 'details'], {relativeTo: this.route})
    }

    searchPeople() {
        const formValue = this.mainForm.value;
        const params = {
            name: formValue.name,
            profession: formValue.profession?.[0]?.id ?? ''
        };

        if(Object.keys(params).length) {
            this.peopleService.getPeople(params)
                .pipe(
                    takeUntil(this.unsubscribe),
                    tap(data => {
                        this.people = data;
                        this.cd.detectChanges();
                    })
                ).subscribe()
        }
    }

    addPerson() {
        const modalRef = this.modalService.show(PeopleEditComponent, {
            class: 'modal-dialog-centered modal-xl'
        })

        modalRef.content.onSave
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((person => {
                this.peopleService.addPerson(person);
            }))
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
