export class GetUserBoardGameCollection {
  static readonly type = '[Collection] GetUserBoardGameCollection';
  constructor(public user_id: string) {}
}
