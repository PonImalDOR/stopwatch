import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, timer } from 'rxjs';
import { debounceTime, filter, map, switchMap, takeUntil, bufferCount } from 'rxjs/operators';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css']
})
export class StopwatchComponent implements OnInit, OnDestroy {
  isOnPause = new BehaviorSubject<boolean>(false);
  starterStopper = new BehaviorSubject<boolean>(false);
  time = '00:00';

  ngOnInit() {
    this.stopWatch().subscribe(value => {
      this.time = this.secondsToMinutes(value);
    });
  }

  ngOnDestroy() {
    this.starterStopper.complete();
    this.isOnPause.complete();
  }

  private stopWatch(): Observable<number> {
    const click$ = fromEvent(document, 'click');
    const doubleClick$ = click$.pipe(
      debounceTime(300),
      filter(() => !this.isOnPause.value),
      bufferCount(2),
      filter(clicks => clicks.length === 2),
      map(() => {})
    );

    return this.starterStopper.pipe(
      switchMap(start => {
        if (start) {
          return timer(0, 1000).pipe(
            map(value => value + 1),
            takeUntil(doubleClick$)
          );
        } else {
          return timer(0);
        }
      })
    );
  }

  startStopTimer() {
    this.starterStopper.next(!this.starterStopper.value);
    this.isOnPause.next(false);
  }

  waitTimer() {
    if (!this.isOnPause.value) {
      this.isOnPause.next(true);
    } else {
      this.isOnPause.next(false);
    }
  }

  resetTimer() {
    this.starterStopper.next(false);
    this.isOnPause.next(false);
    this.time = '00:00';
  }

  private secondsToMinutes(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }

  private padZero(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
