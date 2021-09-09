import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MainComponent } from './Components/main/main.component';
import { PostDashboardComponent } from './Components/post-dashboard/post-dashboard.component';
import { PostDetailsComponent } from './Components/post-details/post-details.component';
import { RegisterComponent } from './Components/register/register.component';
import { RequestlistDashboardComponent } from './Components/requestlist-dashboard/requestlist-dashboard.component';
import { SigninComponent } from './Components/signin/signin.component';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'main', component: MainComponent, children:[
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'news', component: PostDashboardComponent },
    { path: 'news-details', component: PostDetailsComponent },
    { path: 'request-list', component: RequestlistDashboardComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
