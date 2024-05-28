import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {

  public readonly errorMessage: string = "Извините, страница, которую вы ищете, не существует."
  public readonly errorHead: string = "Страница не найдена (404)"
  public readonly backToMain: string = "Вернуться на главную страницу"

}
