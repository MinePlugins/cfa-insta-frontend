import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AdminContentComponent } from './admin-content/admin-content.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminGuard } from './services/admin.guard';
import { AuthGuard } from './services/auth.guard';
import { UserContentComponent } from './user-content/user-content.component';

const routes: Routes = [ {
  path: '',
  component: HomeComponent,
  canActivate: [AuthGuard],
  canActivateChild: [AuthGuard],
  children: [
    {
      path: 'user-content',
      component: UserContentComponent
    },
    {
      path: 'admin-content',
      component: AdminContentComponent,
      canActivate: [AdminGuard]
    },
    {
      path: 'denied',
      component: AccessDeniedComponent
    }
  ]
},
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'logout',
  component: LoginComponent,
  canActivate: [AuthGuard]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
