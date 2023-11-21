import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  correo = ''
  rol = ''
  constructor(

  ) {

  }
  async ngOnInit() {
    const data = await sessionStorage.getItem('userData');
    const { correo } = JSON.parse(data)
    this.correo = correo
    const rols = await sessionStorage.getItem('rol');
    this.rol = rols
  }


}
