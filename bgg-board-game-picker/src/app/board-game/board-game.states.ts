import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { BggCollectionDto } from 'boardgamegeekclient/dist/esm/dto/concrete/BggCollectionDto';
import { BoardGameService } from './board-game.service';
import { GetUserBoardGameCollection } from './board-game.actions';
export const BOARD_GAME_COLLECTION_TOKEN = new StateToken<BggCollectionDto>('UserBoardGameCollection');

export interface BoardGameCollections {
  [key: string]: BggCollectionDto;
}

@State<BoardGameCollections>({
  name: BOARD_GAME_COLLECTION_TOKEN
})
@Injectable()
export class UserBoardGameCollectionState {
  constructor(private boardGameService: BoardGameService) {}

  @Action(GetUserBoardGameCollection)
  getUserBoardGameCollection(ctx: StateContext<BoardGameCollections>, action: GetUserBoardGameCollection) {
    const all_user_collections = ctx.getState()
    const user_id = action.user_id
    if (!all_user_collections[user_id]) {
      this.boardGameService.get_games(user_id)
      .then(result => ctx.patchState({ [user_id] : result[0] }),
            error => console.log(error))
    } else {
      // trigger downstream so things still happen
      ctx.patchState({ [user_id] : all_user_collections[user_id] })
    }
  }
}
