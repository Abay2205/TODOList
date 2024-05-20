import {Routes} from '@angular/router';
import {AddTodoComponent} from "./add-todo/add-todo.component";
import {ListFavouriteComponent} from "./list-favourite/list-favourite.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

export const routes: Routes = [
  {path: '', component: ListFavouriteComponent},
  {path: 'add', component: AddTodoComponent},
  {path: 'list', component: ListFavouriteComponent},
  {path: 'favourite', component: ListFavouriteComponent},
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/404', pathMatch: 'full'},

];
