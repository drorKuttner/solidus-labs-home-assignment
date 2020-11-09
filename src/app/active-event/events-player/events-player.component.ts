import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActiveEventService } from '../services/active-event.service';
import { IEvent } from '../../models/event.model';
import { SPEED_COEFFICIENT } from './config/player-speed.config';
import { EventsListService } from '../../events-list/services/events-list.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { timer } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-events-player',
  templateUrl: './events-player.component.html',
  styleUrls: ['./events-player.component.scss'],
})
export class EventsPlayerComponent implements OnInit, OnDestroy {
  public isPlaying: BehaviorSubject<boolean>;
  public clock: number;
  public isFirstActive: Observable<boolean>;
  public isLastActive: Observable<boolean>;

  private eventsList: IEvent[];
  private eventsListSubscription: Subscription;
  private timerSubscription: Subscription;
  private sortChangeSubscription: Subscription;
  private eventSetByTableSubscription: Subscription;
  private firstActiveEvent: IEvent;

  constructor(
    private activeEventService: ActiveEventService,
    private eventsListService: EventsListService
  ) {
    this.eventsList = [];
    this.isFirstActive = this.activeEventService.isFirstActive;
    this.isLastActive = this.activeEventService.isLastActive;
    this.isPlaying = new BehaviorSubject<boolean>(false);
  }

  public ngOnInit(): void {
    this.eventsListSubscription = this.eventsListService.filteredEventsList.subscribe(
      (eventsList: IEvent[]) => {
        this.eventsList = eventsList;
        setTimeout(() => {
          this.firstActiveEvent = eventsList[0];
          this.resetTimer();
        }, 0);
      }
    );

    this.sortChangeSubscription = this.eventsListService.isDefaultSort.subscribe(
      (isDefaultSort: boolean) => {
        if (!isDefaultSort) {
          this.resetTimer();
        }
      }
    );

    this.eventSetByTableSubscription = this.activeEventService.eventSetByTable.subscribe(
      (event: IEvent) => {
        this.pause();
        this.setPlayerToEvent(event);
      }
    );
  }

  public ngOnDestroy(): void {
    if (!!this.eventsListSubscription) {
      this.eventsListSubscription.unsubscribe();
    }
    if (!!this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (!!this.sortChangeSubscription) {
      this.sortChangeSubscription.unsubscribe();
    }
    if (!!this.eventSetByTableSubscription) {
      this.eventSetByTableSubscription.unsubscribe();
    }
  }

  public get isPlayerEnabled(): Observable<boolean> {
    return this.eventsListService.isDefaultSort.asObservable();
  }

  public setFirst(): void {
    this.pause();
    this.setPlayerToEvent(this.eventsList[0]);
  }

  public setLast(): void {
    this.pause();
    this.setPlayerToEvent(this.eventsList[this.eventsList.length - 1]);
  }

  public play(): void {
    this.isPlaying.next(true);
    this.runClock();
  }

  public pause(): void {
    this.isPlaying.next(false);
  }

  public setPrevious(): void {
    this.pause();
    const previousEvent: IEvent = this.activeEventService.setPreviousEvent();
    this.clock = previousEvent.timestamp;
  }

  public setNext(): void {
    this.pause();
    const nextEvent: IEvent = this.activeEventService.setNextEvent();
    this.clock = nextEvent.timestamp;
  }

  // every timer's tick (millisecond) - it the player is play and not yet got to the end, promote the clock and check for new event
  /*** @SPEED_COEFFICIENT is a const that determines playing speed - can be configured at ./config/player-speed.config ***/
  private runClock(): void {
    this.timerSubscription = timer(1, 1)
      .pipe(withLatestFrom(this.activeEventService.activeEvent, this.isPlaying))
      .subscribe((timerData: [number, IEvent, boolean]) => {
        if (
          timerData[2] &&
          this.clock < this.eventsList[this.eventsList.length - 1].timestamp
        ) {
          this.clock += SPEED_COEFFICIENT;
          if (this.clock >= timerData[1].next.timestamp) {
            this.activeEventService.setNextEvent();
          } else if (
            this.clock >= this.eventsList[this.eventsList.length - 1].timestamp
          ) {
            this.activeEventService.setActiveEvent(
              this.eventsList[this.eventsList.length - 1]
            );
            this.isPlaying.next(false);
          }
        }
      });
  }

  private setPlayerToEvent(event: IEvent): void {
    this.clock = event.timestamp;
    this.activeEventService.setActiveEvent(event);
  }

  private resetTimer(): void {
    this.pause();
    this.setPlayerToEvent(this.firstActiveEvent);
  }
}
