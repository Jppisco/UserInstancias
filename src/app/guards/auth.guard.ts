import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): Observable<boolean> {
    const userDataString = sessionStorage.getItem('userData');

    if (userDataString) {
      const userData = JSON.parse(userDataString);

      if (userData && userData.uid && userData.correo && userData.token) {
        // Restablecer el temporizador
        this.resetTimer();

        return new Observable<boolean>((observer) => {
          observer.next(true);
          observer.complete();
        });
      } else {
        this.router.navigate(['/login']);
        sessionStorage.clear();
        return new Observable<boolean>((observer) => {
          observer.next(false);
          observer.complete();
        });
      }
    } else {
      this.router.navigate(['/login']);
      return new Observable<boolean>((observer) => {
        observer.next(false);
        observer.complete();
      });
    }
  }

  private resetTimer() {
    // Reiniciar el temporizador a 30 minutos (1800000 ms)
    const thirtyMinutes = 30 * 60 * 1000;
    timer(thirtyMinutes).subscribe(() => {
      this.router.navigate(['/login']);
      sessionStorage.clear();
    });
  }
}

