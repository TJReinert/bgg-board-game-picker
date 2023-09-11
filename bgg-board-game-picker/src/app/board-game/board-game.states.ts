import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { BoardGameService } from './board-game.service';
import { GetUserBoardGameCollection } from './board-game.actions';
import { BggCollectionDto } from './board-game.models';
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
      .subscribe({
        next: (result: any) => ctx.patchState({ [user_id] : result }),
        error: (error: any) => console.log(error),
        complete: () => {}
      })
    } else {
      // trigger downstream so things still happen
      ctx.patchState({ [user_id] : all_user_collections[user_id] })
    }
  }
}
