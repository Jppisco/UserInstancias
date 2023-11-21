import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  rol: string;

  constructor(private afAuth: AngularFireAuth,
    private router: Router) {
  }

  async ngOnInit() {
    this.rol = await sessionStorage.getItem('rol');
  }

  logOut() {
    this.afAuth.signOut();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}

