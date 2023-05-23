import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil, tap } from "rxjs";
import { Router } from "@angular/router";
import { PeopleService } from "src/app/shared/services/people-service/people.service";
import { Person } from "src/app/shared/services/people-service/person.interfaces";

@Component({
    selector: "actor-carousel-item",
    templateUrl: "./actor-carousel-item.component.html",
    styleUrls: ["./actor-carousel-item.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ActorCarouselItemComponent implements OnInit, OnDestroy {

    private readonly unsubscribe: Subject<void> = new Subject();
    @Input() personId: string;
    public person: Person;

    constructor(
        private peopleService: PeopleService,
        private router: Router,
        private readonly cd: ChangeDetectorRef
        ) {
    }

    ngOnInit(): void {
        this.setPersonDetails();
    }

    setPersonDetails() {
        this.peopleService.getPersonById(this.personId)
        .pipe(
            takeUntil(this.unsubscribe),
            tap((person) => {
                this.person = person;
                this.cd.detectChanges();
            })
        ).subscribe()
    }

    openDetails() {
        this.router.navigate(["/people/"+this.personId+"/details"]);
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
