import {Component, OnInit} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Component({
    selector: "smart-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {

    public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    ngOnInit(): void {
        this.isLoading$.next(false)
    }
}
