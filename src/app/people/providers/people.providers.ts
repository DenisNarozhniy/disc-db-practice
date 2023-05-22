import { InjectionToken, Provider } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, switchMap } from "rxjs";
import { PeopleService } from "src/app/shared/services/people-service/people.service";
import { Person } from "src/app/shared/services/people-service/person.interfaces";

export const PERSON = new InjectionToken<Observable<Person>>(
    'A stream with current person information'
);

export const PERSON_PROVIDERS: Provider[] = [
    {
        provide: PERSON,
        deps: [ActivatedRoute, PeopleService],
        useFactory: personFactory,
    }
];

export function personFactory(
    { params }: ActivatedRoute,
    peopleService: PeopleService
): Observable<Person> {
    return params.pipe(
        switchMap((params) => {
            const id = params['id'];
            return peopleService.getPersonById(id);
        })
    );
}
