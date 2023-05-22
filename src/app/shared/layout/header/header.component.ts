import {Component, OnInit} from "@angular/core";

@Component({
    selector: "smart-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})

export class HeaderComponent implements OnInit {

    public navItems = [
        {
            name: 'Home',
            link: ''
        },
        {
            name: 'Films',
            link: 'films'
        },
        {
            name: 'People',
            link: 'people'
        },
    ];

    constructor(

        ) {
    }

    ngOnInit(): void {
    }

}
