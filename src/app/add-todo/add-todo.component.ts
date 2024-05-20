import {Component, OnInit} from '@angular/core';
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

  public validateForm = new FormGroup({
    textArea: new FormControl("", [Validators.required, Validators.maxLength(100)]),
    datePicker: new FormControl("", [Validators.required]),
    timePicker: new FormControl("")
  });
  public todos: Todo[] = [];
  public minDate: Date = new Date();
  public id: number = 0;

  constructor(private localStore: LocalStorageService) {
    this.todos = !!localStore.getData('todos')
      ? JSON.parse(localStore.getData('todos') || '')
      : [];
  }

  ngOnInit() {
    this.minDate = new Date()
    this.id = 0
  }

  public onSubmit(): void {
    if (this.validateForm.valid) {
      const dateTime = this.combineDateAndTime();

      if (!dateTime) return;
      const isLocalEmpty = this.localStore.getData('todos')
      if(isLocalEmpty!==null){
        const oldArr = JSON.parse(isLocalEmpty)
        this.id = oldArr.length + 1
      } else {
        this.id = 1
      }
      const todo: Todo = {
        id: this.id,
        textArea: this.validateForm.value.textArea,
        createdAt: new Date,
        Date: dateTime
      }
      this.todos.push(todo);
      this.validateForm.reset();
      this.localStore.saveData('todos', JSON.stringify(this.todos));
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


