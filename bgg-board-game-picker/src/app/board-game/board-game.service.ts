import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { BggClient } from 'boardgamegeekclient';
import { Observable, from } from 'rxjs';
import { BggCollectionDto } from 'boardgamegeekclient/dist/esm/dto/concrete/BggCollectionDto';

@Injectable({
  providedIn: 'root'
})
export class BoardGameService {
  private headers = new HttpHeaders().set('Content-Type', 'text/xml')
  private bggClient = BggClient.Create()
  constructor(private httpClient: HttpClient) {
  }

  get_games(user_id: string): Promise<BggCollectionDto[]> {
    return this.bggClient.collection.query({
      username: user_id,
      excludesubtype: "boardgameexpansion",
      stats: 1,
      own: 1
    })

    // console.log(collections)
    // return collections;
  }
}
