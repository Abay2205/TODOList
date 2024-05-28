import {inject, Injectable} from '@angular/core';
import {LocalStorageService} from "./local-storage.service";
import {Todo} from "./todos.interface";


@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosKey = 'todos';
  private localStorageService = inject(LocalStorageService);

  constructor() {}

  public getTodos(): Todo[] {
    const todosString = this.localStorageService.getData(this.todosKey);
    if (todosString) {
      return JSON.parse(todosString);
    } else {
      return [];
    }
  }

  public addTodo(todo: Todo): void {
    const todos = this.getTodos();
    todos.push(todo);
    this.localStorageService.saveData(this.todosKey, JSON.stringify(todos));
  }

  public updateTodo(index: number, updatedTodo: Todo): void {
    const todos = this.getTodos();
    todos[index] = updatedTodo;
    this.localStorageService.saveData(this.todosKey, JSON.stringify(todos));
  }

  public deleteTodo(index: number): void {
    const todos = this.getTodos();
    todos.splice(index, 1);
    this.localStorageService.saveData(this.todosKey, JSON.stringify(todos));
  }

  public toggleTodoFavorite(index: number): void {
    const todos = this.getTodos();
    todos[index].favorite = !todos[index].favorite;
    this.localStorageService.saveData(this.todosKey, JSON.stringify(todos));
  }
}
