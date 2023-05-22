import { Routes } from "@angular/router";
import { appRoutesNames } from "./app.routes.names";
import { MainComponent } from "./shared/layout/main/main.component";

export const APP_ROUTES: Routes = [
    {
        path: "",
        redirectTo: appRoutesNames.HOME,
        pathMatch: 'full'
    },
    {
        path: "",
        component: MainComponent,
        children: [
            {
                path: appRoutesNames.HOME,
                loadChildren: () => import("./home/home.module").then(m => m.HomeModule)
            },
            {
                path: appRoutesNames.PEOPLE,
                loadChildren: () => import("./people/people.module").then(m => m.PeopleModule)
            },
            {
                path: appRoutesNames.FILMS,
                loadChildren: () => import("./films/films.module").then(m => m.FilmsModule)
            },
        ]
    },
    {
        path: "**",
        redirectTo: appRoutesNames.HOME
    },
];
