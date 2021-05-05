import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { LobbyComponent } from './lobby/lobby.component';

const routes: Routes = [
  { path: '', redirectTo: 'lobby', pathMatch: 'full' },
  { path: 'lobby', component: LobbyComponent },
  { path: 'game/:id', component: GameComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
