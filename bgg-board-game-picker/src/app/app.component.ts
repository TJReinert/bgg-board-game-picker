import { Component } from '@angular/core';
import { BoardGameService } from './board-game/board-game.service';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { BggCollectionDto } from 'boardgamegeekclient/dist/esm/dto/concrete/BggCollectionDto';
import { GetUserBoardGameCollection } from './board-game/board-game.actions';
import {
  BoardGameCollections,
  UserBoardGameCollectionState,
} from './board-game/board-game.states';
import { FormControl, Validators } from '@angular/forms';
import { BggCollectionItemDto } from 'boardgamegeekclient/dist/esm/dto/concrete/subdto/BggCollectionItemDto';
import { shuffle } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Board Game Geek Game Picker';
  number_of_random_games = 3

  username_control = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
  ]);
  current_username = 'asmithnp12';
  number_of_players = 2;
  all_board_games: BoardGameCollections;
  random_games: BggCollectionItemDto[];

  constructor(private store: Store) {
    store.select(UserBoardGameCollectionState).subscribe((result) => {
      this.all_board_games = result;
      this.randomize()
    });
  }

  get_games() {
    if (this.current_username) {
      this.store.dispatch(
        new GetUserBoardGameCollection(this.current_username)
      );
    }
  }

  get_current_game_collection() {
    return this.all_board_games[this.current_username];
  }

  get_current_games_for_search(number_of_players:number) {
    return this.get_current_game_collection().items
               .filter(game => number_of_players ? game?.stats?.minplayers <= number_of_players : true)
               .filter(game => number_of_players ? game?.stats?.maxplayers >= number_of_players : true)
  }


  randomize() {
    this.random_games = this._get_random_games(this.number_of_random_games);
  }

  getErrorMessage() {
    if (
      this.username_control.hasError('required') ||
      this.username_control.hasError('minLength')
    ) {
      return 'You must enter a value';
    }

    return 'Unknown Error';
  }

  _get_random_games(num: number): BggCollectionItemDto[] {
    return shuffle(this.get_current_games_for_search(this.number_of_players)).slice(0, num);
  }
}
