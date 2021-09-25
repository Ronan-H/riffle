import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { LobbyComponent } from './lobby/lobby.component';
import { GameComponent } from './game/game.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameLobbyComponent } from './game/game-lobby/game-lobby.component';
import { SwappingComponent } from './game/swapping/swapping.component';
import { ShowdownComponent } from './game/showdown/showdown.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LobbyComponent,
    GameComponent,
    GameLobbyComponent,
    SwappingComponent,
    ShowdownComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
