import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { MainComponent } from './modules/home/main/main.component';
import { UserListComponent } from './modules/user/user-list/user-list.component';
import { RegisterComponent } from './modules/auth/register/register.component'; 

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',  
    component: RegisterComponent
  },
  {
    path: '',
    redirectTo: '/login',  
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: MainComponent,
    children: [
      {
        path: 'advisors',
        component: UserListComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
