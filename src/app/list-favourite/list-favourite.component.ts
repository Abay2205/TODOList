import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {LocalStorageService} from "../local-storage.service";


@Component({
  selector: 'app-list-favourite',
  standalone: true,
  imports: [CommonModule, MatCheckbox, MatTable, MatHeaderCell, MatColumnDef, MatCell, MatHeaderRow, MatRow, MatHeaderRowDef, MatHeaderCellDef, MatCellDef, MatRowDef, MatCard, MatCardHeader, MatCardSubtitle, MatCardTitle, MatCardContent, MatButton, MatIcon, MatIconButton, MatDialogContent, MatDialogTitle, MatDialogActions, MatDialogClose,],
  templateUrl: './list-favourite.component.html',
  styleUrl: './list-favourite.component.css'
})
export class ListFavouriteComponent implements OnInit {

  @ViewChild('confirmDelete') confirmDelete!: TemplateRef<any>;
  @ViewChild('deleteAll') deleteAll!: TemplateRef<any>;
  readonly title: string = "Today's todo"
  readonly confirm: string = "Are you sure you want to delete this todo?"

  constructor(
    private dialog: MatDialog,
    private localStore: LocalStorageService
  ) {
  }

  public displayedColumns: string[] = ['select', 'textArea', 'createdAt', 'Date', 'delete'];
  public dataSource = new MatTableDataSource<Todo>();
  public selection = new SelectionModel<any>(true, []);
  public todos: Todo[] = [];

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  public toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }


  public checkboxLabel(row?: Todo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }


  ngOnInit() {
    const storedTodos = this.localStore.getData('todos');

    if (storedTodos) {
      this.todos = JSON.parse(storedTodos);
      this.todos.forEach(todo => {
        if (todo.Date !== null) {
          const combinedDateTime = new Date(todo.Date);
          const formattedDateTime = combinedDateTime.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          });
          todo.Date = formattedDateTime;
        }
        if (todo.createdAt) {
          const combinedDateTime = new Date(todo.createdAt);
          const formattedDateTime = combinedDateTime.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          });
          todo.createdAt = formattedDateTime;
        }
      });
      this.dataSource.data = this.todos;
    }
  }

  private deleteTodo(item: Todo) {
    const currentRecord = this.todos.findIndex(m => m.id === item.id);
    this.todos.splice(currentRecord, 1);
    this.localStore.saveData('todos', JSON.stringify(this.todos));
    console.log(item.textArea + 'deleted')
  }

  public openConfirmationModal(row: Todo): void {
    const dialogRef = this.dialog.open(this.confirmDelete, {
      width: '250px',
      data: {todo: row}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTodo(row);
      }
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(this.deleteAll, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alert("delete all todos")
      }
    });
  }
}
