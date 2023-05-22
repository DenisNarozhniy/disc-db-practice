import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Film } from './films.interfaces';
import { Subject, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class FilmsService {

    private readonly filmsKey = 'films';
    
    constructor(
        private store: Firestore
    ) {}

    addFilm(film: Film) {
        setDoc(doc(this.store, this.filmsKey, film.id), film);
    }

    deleteFilm(film: Film) {
        deleteDoc(doc(this.store, this.filmsKey, film.id));
    }

    updateFilm(film) {
        updateDoc(doc(this.store, this.filmsKey, film.id), film);
    }

    getFilmById(id: string) {
        const result = new Subject<Film>();

        getDoc(doc(this.store, this.filmsKey, id))
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

    getFilms(params?) {
        const itemCollection = collection(this.store, this.filmsKey);
        if(!params) return collectionData(itemCollection);
        else {
            return collectionData(itemCollection).pipe(
                map((data:any) => {
                    data = data.filter(film => {
                        if(params.name && params.genres.length)
                            return film.name.toLowerCase().includes(params.name) 
                                && film.genres.some(g => params.genres.every(g2 => g === g2));

                        if(params.name) 
                            return film.name.toLowerCase().includes(params.name);

                        if(params.genres.length) {
                            return film.genres.some(g => params.genres.every(g2 => g === g2))
                        }

                        return true
                    })
                    return data
                })
            );
        }
    }
}