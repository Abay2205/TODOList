import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Todo} from "./todos.interface";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class TodoItemService {

  private localStorageService = inject(LocalStorageService);

  private todoSubject = new BehaviorSubject<Todo[]>(this.localStorageService.getData('todos'))
  todo$ = this.todoSubject.asObservable()


}
