import {Injectable} from '@angular/core';
import {Todo} from "./todos.interface";
import {BehaviorSubject, filter, map, Observable} from "rxjs";
import {DateTime} from "luxon";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private todoSubject = new BehaviorSubject<Todo[]>(this.getData('todos'))
  todo$ = this.todoSubject.asObservable()

  public get todayTodos$(): Observable<Todo[]> {
    return this.todo$.pipe(
      map(todos => this.filterTodosForToday(todos))
    );
  }

  public get validTodos$(): Observable<Todo[]> {
    return this.todo$.pipe(
      map(todos => this.filterValidTodos(todos))
    );
  }

  public get favoriteTodos$() {
    return this.todo$.pipe(
      map(todos => todos.filter(todo => todo.favorite))
    );
  }

  private filterTodosForToday(todos: Todo[]): Todo[] {
    const endOfDay = DateTime.now().endOf('day');
    return todos.filter(todo => {
      if (!todo.date) return false;
      const todoDate = DateTime.fromISO(todo.date as string);
      return todoDate >= DateTime.now() && todoDate <= endOfDay;
    });
  }

  public addTodoOrUpdate(todo: Todo): void {
    const todos = this.todoSubject.value;
    const index = todos.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      todos[index] = todo;
    } else {
      todos.push(todo);
    }
    this.saveData('todos', todos);
  }

  private filterValidTodos(todos: Todo[]): Todo[] {
    return todos.filter(todo => {
      if (!todo.date) return true;
      const todoDate = DateTime.fromISO(todo.date as string);
      return todoDate > DateTime.now().endOf('day');
    });
  }

  public saveData(key: string, value: Todo[]) {
    localStorage.setItem(key, JSON.stringify(value));
    this.todoSubject.next(value)
  }

  public addTodo(todo: Todo) {
    const currentTodos = this.todoSubject.value;
    const updatedTodos = [...currentTodos, todo];
    this.saveData('todos', updatedTodos);
  }

  public deleteTodo(todoId: number) {
    const currentTodos = this.todoSubject.value;
    const updatedTodos = currentTodos.filter(todo => todo.id !== todoId);
    this.saveData('todos', updatedTodos);
  }

  public getData(key: string) {
    const todosString = localStorage.getItem(key)
    if (todosString) {
      return JSON.parse(todosString);
    } else {
      return [];
    }
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
    this.todoSubject.next([])
  }
}
