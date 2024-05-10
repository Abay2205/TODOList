import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {DatePipe, NgIf} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDatepickerModule,} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";



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

  public validateForm = new FormGroup({
    textArea: new FormControl("", [Validators.required, Validators.maxLength(100)]),
    datePicker: new FormControl("", [Validators.required]),
    timePicker: new FormControl("")
  });

  minDate: Date = new Date();
  ngOnInit() {
  }
  onSubmit(){
    if(this.validateForm.valid){
      console.log(this.validateForm.value);
    } else {
      alert('не валдино')
    }
    console.log(this.validateForm.get(['textArea'])?.value)
  }
}


