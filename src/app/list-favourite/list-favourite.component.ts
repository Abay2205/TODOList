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
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
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
import {DateTime} from "luxon";
import {ActivatedRoute} from "@angular/router";


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


  public readonly listTitle: string = "My Todo list";
  public readonly confirm: string = "Are you sure you want to delete this todo?";
  public readonly deleteTitle: string = "Delete Todo";
  public readonly deleteAllTitle: string = "Delete All Todo's";
  public readonly todayColumns: string[] = ['textArea', 'createdAtShow', 'remainingTime'];
  public readonly listColumns: string[] = ['textArea', 'createdAtShow', 'dateShow', 'remainingTime'];

  public todayTitle: string = "Today Todo's";
  public todayDisplayedColumns: string[] = ['select', 'textArea', 'createdAtShow', 'remainingTime', 'favorite', 'delete'];
  public listDisplayedColumns: string[] = ['select', 'textArea', 'createdAtShow', 'dateShow', 'favorite', 'delete'];
  public todayDataSource = new MatTableDataSource<Todo>();
  public listDataSource = new MatTableDataSource<Todo>();
  public favoriteDataSource = new MatTableDataSource<Todo>();
  public todaySelection = new SelectionModel<Todo>(true, []);
  public listSelection = new SelectionModel<Todo>(true, []);
  public favoriteSelection = new SelectionModel<Todo>(true, []);
  public todos: Todo[] = [];
  public today = DateTime.local();
  public isFavoritesView: boolean = false;

  private dialog = inject(MatDialog);
  private localStorageService = inject(LocalStorageService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private readonly todosKey = 'todos';


  ngOnInit() {
    const favorites = this.route.snapshot.data['favorites'];
    this.todos = this.localStorageService.getData(this.todosKey);
    this.isFavoritesView = !!favorites;
    this.todayTitle = favorites ? "Favorite Todos" : this.todayTitle
    if (favorites) {
      this.favoriteDataSource.data = this.todos.filter(todo => todo.favorite);
    } else {
      this.filterTodosForToday();
    }
    this.processTodos();
  }

  toggleRow(event: MatCheckboxChange, row: Todo, selection: SelectionModel<Todo>) {
    if (event) {
      selection.toggle(row)
    } else {
      return;
    }
  }

  toggleFavorite(todo: Todo): void {
    todo.favorite = !todo.favorite;
    this.localStorageService.saveData(this.todosKey, this.todos);
    if (this.isFavoritesView) {
      this.favoriteDataSource.data = this.todos.filter(todo => todo.favorite);
    } else {
      this.filterTodosForToday();
    }
  }

  private processTodos(): void {
    this.todos.forEach(todo => {
      if (todo.date) {
        const todoDate = DateTime.fromISO(todo.date as string);
        todo.remainingTime = this.calculateRemainingTime(todoDate);
        todo.dateShow = todoDate.toLocaleString(DateTime.DATE_MED)
      }
      if (todo.createdAt) {
        const createdAt = DateTime.fromISO(todo.createdAt as string);
        todo.createdAtShow = createdAt.toLocaleString(DateTime.DATE_MED);
      }
    });
  }

  private filterTodosForToday(): void {
    const endOfDay = this.today.endOf('day');

    const filteredTodos = this.todos.filter(todo => {
      if (!todo.date) return false;
      const todoDate = DateTime.fromISO(todo.date as string);
      return todoDate >= DateTime.now() && todoDate <= endOfDay;
    });

    this.todayDataSource.data = filteredTodos;
    const validTodos = this.todos.filter(todo => {
      if (!todo.date) return true;
      const todoDate = DateTime.fromISO(todo.date as string);
      return todoDate > this.today;
    });

    this.listDataSource.data = validTodos.filter(todo => !filteredTodos.includes(todo));
  }

  public isAllSelected(dataSource: MatTableDataSource<Todo>, selection: SelectionModel<Todo>): boolean {
    const numSelected = selection.selected.length;
    const numRows = dataSource.data.length;
    return numSelected === numRows;
  }

  public toggleAllRows(dataSource: MatTableDataSource<Todo>, selection: SelectionModel<Todo>): void {
    if (this.isAllSelected(dataSource, selection)) {
      selection.clear();
    } else {
      selection.select(...dataSource.data);
    }
  }

  public checkboxLabel(row?: Todo | null, selection?: SelectionModel<Todo>): string {
    if (!row) {
      return `${selection && this.isAllSelected(this.todayDataSource, selection) ? 'deselect' : 'select'} all`;
    }
    return `${selection && selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
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
          this.deleteAllTodos();
        }
      });
  }

  private deleteTodo(item: Todo): void {
    const index = this.todos.findIndex(todo => todo.id === item.id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.localStorageService.saveData(this.todosKey, this.todos);
    }
    this.filterTodosForToday();
  }

  private deleteAllTodos(): void {
    this.todos = [];
    this.localStorageService.clearData();
    this.filterTodosForToday();
  }

  private calculateRemainingTime(expiryDate: DateTime): string {
    const now = DateTime.local();
    const diff = expiryDate.diff(now, ['days', 'hours', 'minutes']);

    if (diff.as('milliseconds') <= 0) {
      return 'Expired';
    }

    let remainingTime = '';
    if (diff.days > 0) remainingTime += `${Math.floor(diff.days)}d `;
    if (diff.hours > 0 || diff.days > 0) remainingTime += `${Math.floor(diff.hours)}h `;
    remainingTime += `${Math.floor(diff.minutes)}m`;

    return remainingTime;
  }
}


