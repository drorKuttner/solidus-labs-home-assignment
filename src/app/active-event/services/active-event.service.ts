import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { IEvent } from '../../models/event.model';
import { EventsListService } from '../../events-list/services/events-list.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ActiveEventService {
  public eventSetByTable: Subject<IEvent>; // notify player
  private readonly activeEventSubject: BehaviorSubject<IEvent>;

  constructor(private eventsListService: EventsListService) {
    this.activeEventSubject = new BehaviorSubject<IEvent>(undefined);
    this.eventSetByTable = new Subject<IEvent>();
  }

  public get activeEvent(): Observable<IEvent> {
    return this.activeEventSubject.asObservable();
  }

  public get isFirstActive(): Observable<boolean> {
    return this.activeEventSubject.pipe(
      map((event: IEvent) => {
        return !!event && event.index === 0;
      })
    );
  }

  public get isLastActive(): Observable<boolean> {
    return this.activeEventSubject.pipe(
      map((event: IEvent) => {
        return (
          !!event && event.index === this.eventsListService.eventListLength - 1
        );
      })
    );
  }

  public setActiveEvent(event: IEvent): void {
    this.activeEventSubject.next(event);
  }

  public setPreviousEvent(): IEvent {
    const previousEvent: IEvent = this.eventsListService.getPreviousEvent(
      this.activeEventSubject.getValue().index
    );
    this.activeEventSubject.next(previousEvent);
    return previousEvent;
  }

  public setNextEvent(): IEvent {
    const nextEvent: IEvent = this.eventsListService.getNextEvent(
      this.activeEventSubject.getValue().index
    );
    this.activeEventSubject.next(nextEvent);
    return nextEvent;
  }
}
