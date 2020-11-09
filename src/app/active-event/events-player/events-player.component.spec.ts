import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsPlayerComponent } from './events-player.component';

describe('EventsPlayerComponent', () => {
  let component: EventsPlayerComponent;
  let fixture: ComponentFixture<EventsPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
