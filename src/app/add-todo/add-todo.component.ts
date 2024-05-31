import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {NgIf} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDatepickerModule,} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {Todo} from "../todos.interface";
import {LocalStorageService} from "../local-storage.service";
import {Router} from "@angular/router";
import {combineLatest, debounceTime, distinctUntilChanged, filter} from "rxjs";


@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatDatepickerModule, MatNativeDateModule,
    NgxMaterialTimepickerModule, NgIf, MatCardModule, MatCardHeader, MatCardActions, MatCardContent
  ],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.css'
})


export class AddTodoComponent implements OnInit {

  public readonly addTodo: string = "Add Todo"
  public readonly dateFormat: string = "MM/DD/YYYY"
  public readonly timeFormat: string = "hh/mm"
  public readonly textArea: string = "textArea"
  public readonly required: string = "This is required"
  public readonly maxLength: string = "Max 100 symbol"
  public readonly chooseDate: string = "Choose date"
  public readonly chooseTime: string = "Choose time"
  public readonly createTodo: string = "Create Todo"
  private readonly todosKey = 'todos';

  public validateForm = new FormGroup({
    textArea: new FormControl("", [Validators.required, Validators.maxLength(100)]),
    datePicker: new FormControl("", [Validators.required]),
    timePicker: new FormControl("")
  });
  public todos: Todo[] = [];
  public minDate: Date = new Date();
  public id: number = 0;

  private router = inject(Router);
  private localStorageService = inject(LocalStorageService);

  ngOnInit() {
    this.minDate = new Date()
    this.id = 0;
    const controls = Object.values(this.validateForm.controls);

    //эта подписка выводит сообщение если форма заполнена
    combineLatest(controls.map(control => control.valueChanges)).pipe(
      // Используем debounceTime для задержки отправки значений на 500 мс
      debounceTime(500),
      // Используем distinctUntilChanged для фильтрации одинаковых значений
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      filter(values => values.every(value => !!value))
    ).subscribe(values => {
      console.log('All fields are filled:', values);
    })

    //эта подписка для отслеживания изменений
    this.localStorageService.todo$
      .subscribe(todos => {
        this.todos = todos;
        console.log('Updated todos:', this.todos);
      });
  }

  public onSubmit(): void {
    if (this.validateForm.valid) {
      const dateTime = this.combineDateAndTime();

      if (!dateTime) {
        console.log(dateTime)
        return;
      }
      const todos = this.localStorageService.getData(this.todosKey);
      this.id = todos.length ? Math.max(...todos.map((todo: Todo) => todo.id)) + 1 : 1;

      const todo: Todo = {
        id: this.id,
        textArea: this.validateForm.value.textArea,
        createdAt: new Date,
        date: dateTime,
        favorite: false
      }
      this.localStorageService.addTodo(todo);
      this.validateForm.reset();
      this.router.navigate(['/list']);
      console.log(this.todos);
    } else {
      alert('не валидно')
    }
  }

  private combineDateAndTime(): Date | null {
    const date = this.validateForm.value.datePicker;
    const time = this.validateForm.value.timePicker;

    if (!date || !time) return null;
    const [timeString, period] = time.split(' ');
    const [hoursString, minutesString] = timeString.split(':');
    let hours = parseInt(hoursString);
    const minutes = parseInt(minutesString);

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(hours, minutes);

    return combinedDateTime;
  }
}


