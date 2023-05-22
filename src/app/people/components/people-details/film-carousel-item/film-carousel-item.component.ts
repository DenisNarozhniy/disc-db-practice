import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { Film } from "src/app/shared/services/films-service/films.interfaces";
import { Router } from "@angular/router";

@Component({
    selector: "film-carousel-item",
    templateUrl: "./film-carousel-item.component.html",
    styleUrls: ["./film-carousel-item.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilmCarouselItemComponent implements OnInit, OnDestroy {

    private readonly unsubscribe: Subject<void> = new Subject();
    @Input() film: Film;

    constructor(
        private router: Router
        ) {
    }

    ngOnInit(): void {
    }

    truncName(name:string) {
        if(name.length < 30) return name
        else return (name.substring(0, 30) + '...')
    }
    
    openDetails() {
        this.router.navigate(["/films/"+this.film.id+"/details"]);
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
