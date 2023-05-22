import { PeopleComponent } from './components/people-component/people.component';
import { PeopleDetailsComponent } from './components/people-details/people-details.component';
import { peopleRoutesNames } from './people.route.names';

export const PeopleRoutes = [
    {
        path: peopleRoutesNames.People,
        component: PeopleComponent
    },
    {
        path: peopleRoutesNames.Details,
        component: PeopleDetailsComponent
    },
];
