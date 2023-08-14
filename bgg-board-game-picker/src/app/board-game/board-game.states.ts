import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { BggCollectionDto } from 'boardgamegeekclient/dist/esm/dto/concrete/BggCollectionDto';
import { BoardGameService } from './board-game.service';
import { GetUserBoardGameCollection } from './board-game.actions';
const BOARD_GAME_COLLECTION_TOKEN = new StateToken<BggCollectionDto>('UserBoardGameCollection');

@State<BggCollectionDto>({
  name: BOARD_GAME_COLLECTION_TOKEN
})
@Injectable()
export class UserBoardGameCollectionState {
  constructor(private boardGameService: BoardGameService) {}

  @Action(GetUserBoardGameCollection)
  getUserBoardGameCollection(ctx: StateContext<BggCollectionDto>,
    action: GetUserBoardGameCollection) {
    // const state = ctx.getState();
    console.log(ctx)
    this.boardGameService.get_games(action.user_id)
                         .then(result => ctx.patchState(result[0]), error => console.log(error) )
  }
}
