import {Component, OnDestroy, OnInit} from "@angular/core";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Subject} from "rxjs";

@Component({
    selector: "confirm",
    templateUrl: "./confirm.component.html",
    styleUrls: ["./confirm.component.scss"]
})

export class ConfirmComponent implements OnInit, OnDestroy {

    private readonly unsubscribe: Subject<void> = new Subject();

    public onSave: Subject<any> = new Subject<any>();
    public message

    constructor(private modalService: BsModalService,
        private modalRef: BsModalRef) {
    }

    ngOnInit(): void {
    }

    confirm() {
        this.onSave.next(true);
        this.onSave.complete();
        this.close();
    }

    close() {
        this.modalRef.hide();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
