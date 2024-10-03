import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserServicesService } from '../../services/user-services.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private userService: UserServicesService, private router: Router) {}

  register() {
    this.userService.registerUser(this.username, this.email, this.password)
      .subscribe(
        (response) => {
          console.log('User registered successfully', response);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error registering user', error);
        }
      );
  }
}
