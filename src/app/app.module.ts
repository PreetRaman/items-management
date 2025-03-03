import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ProposalListComponent } from './proposal-list/proposal-list.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

const routes: Routes = [
  { path: 'items', component: ItemListComponent },
  { path: 'proposals', component: ProposalListComponent },
  { path: '', redirectTo: 'items', pathMatch: 'full' }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    NavBarComponent,
    ItemListComponent,
    ProposalListComponent,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
