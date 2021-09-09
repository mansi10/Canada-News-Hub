import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatRadioModule} from '@angular/material/radio';
import {MatDividerModule} from '@angular/material/divider';
// import {MatSnackBarModule} from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SigninComponent } from './Components/signin/signin.component';
import { RegisterComponent } from './Components/register/register.component';
import { PostDashboardComponent } from './Components/post-dashboard/post-dashboard.component';
import { CreatePostComponent } from './Components/create-post/create-post.component';
import { PostDetailsComponent } from './Components/post-details/post-details.component';
import { RequestlistDashboardComponent } from './Components/requestlist-dashboard/requestlist-dashboard.component';
import { RequestlistDetailsComponent } from './Components/requestlist-details/requestlist-details.component';
import { MainComponent } from './Components/main/main.component';
import { CommentComponent } from './Components/comment/comment.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    RegisterComponent,
    PostDashboardComponent,
    CreatePostComponent,
    PostDetailsComponent,
    RequestlistDashboardComponent,
    RequestlistDetailsComponent,
    MainComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule, ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatStepperModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatRippleModule,
    MatTooltipModule,
    MatDialogModule,
    MatGridListModule,
    HttpClientModule,
    MatRadioModule,
    MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
