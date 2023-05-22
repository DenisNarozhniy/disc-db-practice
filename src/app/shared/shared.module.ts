import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LayoutModule } from "./layout/layout.module";
import { ConfirmComponent } from "./confirm/confirm.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

@NgModule({
    declarations: [
        ConfirmComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LayoutModule,
        NgMultiSelectDropDownModule,
        BsDatepickerModule 
    ],
    exports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        LayoutModule,
        ConfirmComponent,
        NgMultiSelectDropDownModule,
        BsDatepickerModule 
    ],
    providers: []
})
export class SharedModule {
}
