import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, retry, switchMap } from 'rxjs';
import * as xml2js from 'xml2js';
import { BggCollectionDto, BggCollectionItemDto, BggCollectionItemStatRatingDto, BggCollectionItemStatRatingRanksDto, BggCollectionItemStatsDto, BggCollectionItemStatusDto } from './board-game.models';


export interface RetryData {
  data: any;
  retry: boolean;
  count: number;
}


@Injectable({
  providedIn: 'root',
})
export class BoardGameService {
  private headers = new HttpHeaders().set('Accept', '*/*');
  constructor(private httpClient: HttpClient) {}


  get_games(user_id: string): Observable<BggCollectionDto[]> {
    // return this.httpClient.get('assets/test-data/data.xml', {
    //     headers: this.headers,
    //     responseType: 'text',
    //     observe: "response"
    //   })
    return this.httpClient.get(`https://boardgamegeek.com/xmlapi2/collection`, {
      params: {
        'username': user_id,
        'excludesubtype': 'boardgameexpansion',
        'stats': '1',
        'own': "1"
      },
        headers: this.headers,
        responseType: 'text',
        observe: "response"
      })
      .pipe(
        map(resp => {
          var status = resp.status
          if (status == 202) {
            throw resp
          }
          return resp
        }),
        retry({
          count: 5,
          delay: 1500
        }),
        switchMap(async (resp) => await this.parseXmlToJson(resp.body || ""))
      )
  }
  parseXmlToJson(xml: string): any {
    // With parser
    const parser = new xml2js.Parser({ explicitArray: false });
    return parser
      .parseStringPromise(xml)
      .then( (result: any) => {
        const header = result?.items;
        var converted = [];
        for (let item of this.ensure_array(header?.item)) {
          var ranks = []
          for (let rank of this.ensure_array(item?.stats?.rating?.ranks?.rank)) {
            ranks.push({
              type: rank?.$?.type,
              id: parseInt(rank?.$?.id),
              name: rank?.$?.name,
              friendlyname: rank?.$?.friendlyname,
              value: parseInt(rank?.$?.value),
              bayesaverage: parseInt(rank?.$?.bayesaverage),
            } as BggCollectionItemStatRatingRanksDto)
          }
          converted.push({
            objectid: item?.$.objectid,
            collid: item?.$.collid,
            objecttype: item?.$.objecttype,
            subtype: item?.$.subtype,
            yearpublished: item?.yearpublished,
            numplays: parseInt(item?.numplays),
            image: item?.image,
            thumbnail: item?.thumbnail,
            comment: item?.comment,
            wishlistcomment: item?.wishlistcomment,
            name: item?.name?._,
            originalname: item?.name?.originalname,
            // wantpartslist: "",
            // haspartslist: "",
            conditiontext: item?.conditiontext,
            status: {
              own: parseInt(item?.status?.$?.own),
              prevowned: parseInt(item?.status?.$?.prevowned),
              fortrade: parseInt(item?.status?.$?.fortrade),
              want: parseInt(item?.status?.$?.want),
              wanttoplay: parseInt(item?.status?.$?.wanttoplay),
              wanttobuy: parseInt(item?.status?.$?.wanttobuy),
              wishlist: parseInt(item?.status?.$?.wishlist),
              wishlistpriority: parseInt(item?.status?.$?.wishlistpriority),
              preordered: parseInt(item?.status?.$?.preordered),
              lastmodified: item?.status?.$?.lastmodified
            } as BggCollectionItemStatusDto,
            stats: {
              minplayers: parseInt(item?.stats?.$?.minplayers),
              maxplayers: parseInt(item?.stats?.$?.maxplayers),
              minplaytime: parseInt(item?.stats?.$?.minplaytime),
              maxplaytime: parseInt(item?.stats?.$?.maxplaytime),
              playingtime: parseInt(item?.stats?.$?.playingtime),
              numowned: parseInt(item?.stats?.$?.numowned),
              rating: {
                value: parseInt(item?.stats?.$?.value),
                usersrated: parseInt(item?.stats?.usersrated?.$?.value),
                average: parseInt(item?.stats?.average?.$?.value),
                bayesaverage: parseInt(item?.stats?.bayesaverage?.$?.value),
                stddev: parseInt(item?.stats?.stddev?.$?.value),
                median: parseInt(item?.stats?.median?.$?.value),
                ranks: ranks
              } as BggCollectionItemStatRatingDto
            } as BggCollectionItemStatsDto,
          } as BggCollectionItemDto);
        }
        return {
          totalitems: parseInt(header?.$?.totalitems),
          pubdate: header?.$?.pubdate,
          items: converted
        } as BggCollectionDto
      })
      .catch(function (err: any) {
        console.log(err);
      });
  }

  ensure_array(obj: any) {
    if (obj) {
      if (Array.isArray(obj)) {
        return obj
      }
      return [obj]
    }
    return []
  }
}
