import {Component, DestroyRef, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";


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
  readonly todayTitle: string = "Today Todo's"
  readonly listTitle: string = "My Todo list"
  readonly confirm: string = "Are you sure you want to delete this todo?"
  readonly deleteTitle: string = "Delete Todo"
  readonly deleteAllTitle: string = "Delete Todo"

  constructor() {
  }

  private dialog = inject(MatDialog);
  private localStorageService = inject(LocalStorageService);
  private destroyRef = inject(DestroyRef);

  public displayedColumns: string[] = ['select', 'textArea', 'createdAt', 'Date', 'delete'];
  public todayDataSource = new MatTableDataSource<Todo>();
  public listDataSource = new MatTableDataSource<Todo>();
  public selection = new SelectionModel<any>(true, []);
  public todos: Todo[] = [];
  public today = new Date();

  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.todayDataSource.data.length;
    return numSelected === numRows;
  }


  public toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.todayDataSource.data);
  }


  public checkboxLabel(row?: Todo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }


  ngOnInit() {
    const storedTodos = this.localStorageService.getData('todos');
    if (storedTodos) {
      this.todos = JSON.parse(storedTodos);
      this.filterTodosForToday();
      this.todos.forEach(todo => {
        if (todo.Date) {
          const todoDate = new Date(todo.Date);
          todoDate.setHours(0, 0, 0, 0);
          this.today.setHours(0, 0, 0, 0);
          if (todoDate.getTime() === this.today.getTime()) {
            todo.Date = this.calculateRemainingTime(todo.Date);
          } else {
            const combinedDateTime = new Date(todo.Date);
            const formattedDateTime = combinedDateTime.toLocaleString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            });
            todo.Date = formattedDateTime;
          }
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

    }
  }

  private filterTodosForToday(): void {
    const startOfDay = new Date(this.today.getTime());
    const endOfDay = new Date(this.today.setHours(23, 59, 59, 999));

    const filteredTodos = this.todos.filter(todo => {
      if (!todo.Date) {
        console.log('false');
        return false;
      }
      const todoDate = new Date(todo.Date);
      return todoDate >= startOfDay && todoDate <= endOfDay;
    });
    this.todayDataSource.data = filteredTodos
    const remainingTodos = this.todos.filter(todo => !filteredTodos.includes(todo));
    this.listDataSource.data = remainingTodos;
  }

  private calculateRemainingTime(expirationDate: string | Date): string | Date {
    const now = new Date();
    const expiryDate = new Date(expirationDate);
    const timeDifference = expiryDate.getTime() - now.getTime();

    if (timeDifference <= 0) {
      return expirationDate + ' expired';
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    let remainingTime = '';
    if (days > 0) {
      remainingTime += `${days}d `;
    }
    if (hours > 0 || days > 0) {
      remainingTime += `${hours}h `;
    }
    remainingTime += `${minutes}m`;

    return remainingTime;
  }


  private deleteTodo(item: Todo): void {
    const currentRecord = this.todos.findIndex(m => m.id === item.id);
    this.todos.splice(currentRecord, 1);
    this.localStorageService.saveData('todos', JSON.stringify(this.todos));
    this.localStorageService.removeData('id')
    console.log(item.textArea + ' deleted')
  }

  private deleteAllTodos(): void {
    this.localStorageService.clearData()
  }

  public openConfirmationModal(row: Todo): void {
    const dialogRef = this.dialog.open(this.confirmDelete, {
      width: '250px',
      data: {todo: row}
    });
    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
      if (result) {
        this.deleteTodo(row);
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(this.deleteAll, {
      width: '250px'
    });
    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
      if (result) {
        alert("delete all todos")
        this.deleteAllTodos()
      }
    });
  }
}

//TODO СДЕЛАТЬ ЧТОБЫ DATASOURCE БЫЛ 1 ИЛИ ДВА РАЗНЫХ SELECTROWS
//TODO ИЗ ВТОРОЙ КАРТОЧКИ УБРАТЬ EXPIRED
//TODO СДЕЛАТЬ ВРЕМЯ КРАСНЫМ ЕСЛИ ОСТАЛОСЬ МЕНЬШЕ ЧАСА
//
