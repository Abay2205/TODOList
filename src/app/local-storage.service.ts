import { Injectable } from '@angular/core';
import {Todo} from "./todos.interface";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private todoSubject = new BehaviorSubject<Todo[]>(this.getData('todos'))
  todo$ = this.todoSubject.asObservable()  //Не знаю почему нельзя todo$ =  new BehaviorSubject<Todo[]>(this.getData('todos'))

  public saveData(key: string, value: Todo[]) {
    localStorage.setItem(key, JSON.stringify(value));
    this.todoSubject.next(value) //работает как надо
  }

  public addTodo(todo: Todo) {
    const currentTodos = this.todoSubject.value;  //тут initial value из behavior берем да?
    const updatedTodos = [...currentTodos, todo]; // здесь типо изначальный массив + новый? Не понял ничего тут
    this.saveData('todos', updatedTodos);
  }

  public deleteTodo(todoId: number) {
    const currentTodos = this.todoSubject.value;  //тут вроде понятное все
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
