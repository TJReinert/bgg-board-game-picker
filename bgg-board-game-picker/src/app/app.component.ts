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
import { range, shuffle } from 'lodash';
import { faChevronDown, faHourglass, faPlay, faUserLarge } from '@fortawesome/free-solid-svg-icons';
import { unescape } from 'lodash';

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
  number_of_players_options = range(1, 10)
  number_of_players = 2;
  all_board_games: BoardGameCollections;
  random_games: BggCollectionItemDto[];

  time = faHourglass;
  players = faUserLarge;
  plays = faPlay;
  expand = faChevronDown;
  loading = false

  constructor(private store: Store) {
    store.select(UserBoardGameCollectionState).subscribe((result) => {
      this.all_board_games = result;
      this.loading = false;
      this.randomize()
    });
  }

  get_games() {
    if (this.current_username) {
      this.loading = true
      this.store.dispatch(
        new GetUserBoardGameCollection(this.current_username)
      );
    }
  }

  get_current_game_collection() {
    return this.all_board_games[this.current_username];
  }

  get_current_games_for_search(number_of_players?: number) {
    if (!number_of_players) {
      number_of_players = this.number_of_players
    }
    return this.get_current_game_collection()?.items
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

  search_disabled() {
    return this.loading || this.username_control.invalid
  }

  get_game_title(game_name: String) {
    return unescape(game_name.replaceAll("&#039;", "&#39;"))
  }

  get_time_text(game: BggCollectionItemDto) {
    var min = game?.stats?.minplaytime
    var max = game?.stats?.maxplaytime
    if (!min && !max) {
      return `Unknown minutes`
    }
    if (min == max) {
      return `${min} minutes`
    }
    return `${min}-${max} minutes`
  }

  get_playcount_text(plays: Number) {
    if (plays === 1) {
      var suffix = 'play'
    } else {
      var suffix = 'plays'
    }
    return `${plays} ${suffix}`
  }

  get_players_text(game: BggCollectionItemDto) {
    var min = game?.stats?.minplayers
    var max = game?.stats?.maxplayers

    if (min === max) {
      if (min === 1) {
        return `1 player`
      }
      return `${min} players`
    }
    return `${min} - ${max} players`
  }

  _get_random_games(num: number): BggCollectionItemDto[] {
    return shuffle(this.get_current_games_for_search(this.number_of_players)).slice(0, num);
  }
}
