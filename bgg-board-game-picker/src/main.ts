import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngxs/store';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { UserBoardGameCollectionState } from './app/board-game/board-game.states';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideStore(
      [UserBoardGameCollectionState],
      withNgxsStoragePlugin({ keys: [UserBoardGameCollectionState] })
    ),
  ],
}).catch(err => console.error(err));
