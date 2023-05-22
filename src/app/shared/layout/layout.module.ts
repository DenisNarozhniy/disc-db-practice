import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MainComponent} from "./main/main.component";
import {RouterModule} from "@angular/router";
import { HeaderComponent } from "./header/header.component";

@NgModule({
    declarations: [MainComponent, HeaderComponent],
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [MainComponent, HeaderComponent]
})
export class LayoutModule {
}
