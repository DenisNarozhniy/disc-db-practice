import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Person } from './person.interfaces';
import { Subject, map, tap } from 'rxjs';
import { FilmsService } from '../films-service/films.service';

@Injectable({
    providedIn: 'root',
})

export class PeopleService {

    private readonly peopleKey = 'people';

    constructor(
        private store: Firestore,
        private filmsService: FilmsService
    ) {}

    addPerson(person: Person) {
        setDoc(doc(this.store, this.peopleKey, person.id), person);
    }

    deletePerson(person: Person) {
        this.filmsService.getFilms()
            .pipe(tap(films => {
                films.forEach((f:any) => {
                    let update = false;
                    if(f.actors.includes(person.id)) {
                        f.actors = f.actors.filter(a => a != person.id);
                        update = true;
                    }
                    if(f.director === person.id) {
                        f.director = "";
                        update = true;
                    }
                    
                    if(update) this.filmsService.updateFilm(f);
                })
                deleteDoc(doc(this.store, this.peopleKey, person.id));
            }))
            .subscribe()
    }

    updatePerson(person) {
        updateDoc(doc(this.store, this.peopleKey, person.id), person);
    }

    getPersonById(id: string) {
        const result = new Subject<Person>();

        getDoc(doc(this.store, this.peopleKey, id))
            .then(data => {
                if(data.exists()) {
                    result.next(data.data())
                    result.complete();
                } else {
                    result.error('Data does not exist!')
                    result.complete();
                }
            })
            .catch(error => {
                result.error(error)
                result.complete();
            })

        return result
    }

    getPeople(params?) {
        const itemCollection = collection(this.store, this.peopleKey);

        if(!params) return collectionData(itemCollection)
        else {
            return collectionData(itemCollection).pipe(
                map((data:any) => {
                    data = data.filter(person => {
                        if(params.name && params.profession)
                            return person.name.toLowerCase().includes(params.name) 
                                && person.profession === params.profession;

                        if(params.name) 
                            return person.name.toLowerCase().includes(params.name);

                        if(params.profession) {
                            return person.profession === params.profession;
                        }

                        return true
                    })
                    return data
                })
            );
        }

    }
}