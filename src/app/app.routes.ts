import { Routes } from '@angular/router';
import {AddTodoComponent} from "./add-todo/add-todo.component";
import {ListFavouriteComponent} from "./list-favourite/list-favourite.component";

export const routes: Routes = [
  {
    path: 'add',
    component: AddTodoComponent,
  },{
    path: 'list',
    component: ListFavouriteComponent,
  },{
    path: 'favourite',
    component: ListFavouriteComponent,
  },
];
