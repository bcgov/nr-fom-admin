import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProjectService } from 'core/services/project.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    // although we aren't currently using numApplications,
    // this verifies our login token and redirects in case of error
    this.projectService
      .getCount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        () => {},
        () => {
          console.log('error = could not count applications');
        }
      );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
