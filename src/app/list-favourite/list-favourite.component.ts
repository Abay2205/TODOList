import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Todo} from "../todos.interface";
import {CommonModule} from "@angular/common";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";


@Component({
  selector: 'app-list-favourite',
  standalone: true,
  imports: [CommonModule, MatCheckbox, MatTable, MatHeaderCell, MatColumnDef, MatCell, MatHeaderRow, MatRow, MatHeaderRowDef, MatHeaderCellDef, MatCellDef, MatRowDef, MatCard, MatCardHeader, MatCardSubtitle, MatCardTitle, MatCardContent, MatButton, MatIcon, MatIconButton, MatDialogContent, MatDialogTitle, MatDialogActions, MatDialogClose,],
  templateUrl: './list-favourite.component.html',
  styleUrl: './list-favourite.component.css'
})
export class ListFavouriteComponent implements OnInit {
  @ViewChild('confirmationDialog') confirmationDialog!: TemplateRef<any>;
  constructor(
    private dialog: MatDialog
  ) {
  }

  displayedColumns: string[] = ['select', 'textArea', 'createdAt', 'Date', 'Time', 'delete'];
  dataSource = new MatTableDataSource<Todo>();
  selection = new SelectionModel<any>(true, []);
  todos: Todo[] = [];

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }


  checkboxLabel(row?: Todo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }


  ngOnInit() {
    const storedTodos = localStorage.getItem('todos');

    if (storedTodos) {
      this.todos = JSON.parse(storedTodos);
      this.dataSource.data = this.todos;
    }
  }

  deleteTodo(item: Todo) {
    const currentRecord = this.todos.findIndex(m => m.id === item.id);
    this.todos.splice(currentRecord, 1);
    localStorage.setItem('todos', JSON.stringify(this.todos));
    console.log(item.textArea + 'deleted')
  }

  openConfirmationModal(row: Todo): void {
    const dialogRef = this.dialog.open(this.confirmationDialog, {
      width: '250px',
      data: {todo: row}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Если пользователь подтвердил удаление
        this.deleteTodo(row);
      }
    });
  }
}
