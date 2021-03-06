import { Component, OnInit } from '@angular/core';
import { UxService } from 'src/app/service/ux.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {  

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  credenciales = {
    name: '',
    email: '',
    password: ''
  }
  
  form = {
    checkbox: false
  }
  
  register() {    
    this.authService.register(this.credenciales.name, this.credenciales.email, this.credenciales.password, this.form.checkbox);
  }

  googleRegister() {
    this.authService.googleLogin();
  }
  
}
