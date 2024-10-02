import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AsyncPipe, CommonModule, NgIf} from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './modules/home/main/main.component';
import { SidebarComponent } from './modules/home/sidebar/sidebar.component';
import { HeaderComponent } from './modules/home/header/header.component';
import { DashboardComponent } from './modules/home/dashboard/dashboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { ViewTaskModalComponent } from './modules/user/components/view-task-modal/view-task-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    SidebarComponent,
    HeaderComponent,
    DashboardComponent,
    ViewTaskModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    CommonModule,
    AsyncPipe,
    NgIf,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
