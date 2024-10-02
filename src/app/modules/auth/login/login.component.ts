import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServicesService } from '../../services/user-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';
  constructor(
    private readonly router: Router,
    private userService: UserServicesService
  ) {}

  onSubmit() {
    this.userService.loginUser(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);

        this.router.navigate(['home']);
      },
      error: (err) => {
        this.errorMessage = 'Credenciales incorrectas, intenta de nuevo.';
        alert(this.errorMessage);
      }
    });
  }
}
