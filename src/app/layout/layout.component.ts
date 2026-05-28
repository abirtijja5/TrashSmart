import { Component, OnInit } from '@angular/core';
import { AuthService, CurrentUser } from '../auth/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  user: CurrentUser | null = null;
  alertCount = 0;
  criticalBins = 0;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(u => { this.user = u; });
  }

  logout(): void { this.auth.logout(); }

  get initials(): string {
    if (!this.user?.name) return 'AD';
    return this.user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
}
