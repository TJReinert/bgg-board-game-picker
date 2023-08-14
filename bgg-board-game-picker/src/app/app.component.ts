import { Component } from '@angular/core';
import { BoardGameService } from './board-game/board-game.service';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { BggCollectionDto } from 'boardgamegeekclient/dist/esm/dto/concrete/BggCollectionDto';
import { GetUserBoardGameCollection } from './board-game/board-game.actions';
import { UserBoardGameCollectionState } from './board-game/board-game.states';
import { FormControl, Validators } from '@angular/forms';
import { BggCollectionItemDto } from 'boardgamegeekclient/dist/esm/dto/concrete/subdto/BggCollectionItemDto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Board Game Geek Game Picker';

  username = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
  ]);
  board_games: BggCollectionDto;
  random_game: BggCollectionItemDto;

  constructor(private store: Store) {
    store
      .select(UserBoardGameCollectionState)
      .subscribe((result) => {
        this.board_games = result
        this.random_game = result.items[Math.floor(Math.random() * result.items.length)];
      });
  }

  get_games() {
    if (this.username.value) {
      this.store.dispatch(new GetUserBoardGameCollection(this.username.value));
    }
  }

  getErrorMessage() {
    if (
      this.username.hasError('required') ||
      this.username.hasError('minLength')
    ) {
      return 'You must enter a value';
    }

    return 'Unknown Error';
  }
}
