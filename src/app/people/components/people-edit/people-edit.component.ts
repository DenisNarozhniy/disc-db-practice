import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { Film } from "src/app/shared/services/films-service/films.interfaces";
import { Person } from "src/app/shared/services/people-service/person.interfaces";
import { Professions } from "src/assets/export-variables.const";
import { getNewUUID } from "src/assets/utils.functions";

@Component({
    selector: "people-edit",
    templateUrl: "./people-edit.component.html",
    styleUrls: ["./people-edit.component.scss"]
})

export class PeopleEditComponent implements OnInit, OnDestroy {

    private readonly unsubscribe: Subject<void> = new Subject();
    public onSave = new Subject<Film>();
    public mainForm: FormGroup;
    public professions = [];
    public professionsSelectSettings: IDropdownSettings = {
        singleSelection: true,
        idField: 'id',
        textField: 'text',
        allowSearchFilter: true
    };
    public person;


    constructor(
        private readonly fb: FormBuilder,
        private readonly modalRef: BsModalRef,
        ) {
    }

    ngOnInit(): void {
        this.mainForm = this.fb.group({
            id: this.fb.control(getNewUUID()),
            name: this.fb.control('', [Validators.required]),
            imgUrl: this.fb.control('', []),
            bio: this.fb.control('', []),
            birthPlace: this.fb.control('', []),
            age: this.fb.control(60, []),
            profession: this.fb.control([{ id: 'Actor', text: 'Actor' }], []),
        })

        if(this.person) this.mainForm.patchValue(this.person);
        this.professions = Professions.map(p => {return { id: p, text: p }});
    }

    save() {        
        if(this.mainForm.invalid) return

        const formValue = this.mainForm.value;
        const person: Person = {
            id: formValue.id,
            name: formValue.name,
            imgUrl: formValue.imgUrl,
            age: formValue.age,
            bio: formValue.bio,
            profession: formValue.profession?.[0]?.id ?? '',
            birthPlace: formValue.birthPlace
        };
        
        this.onSave.next(person);
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
