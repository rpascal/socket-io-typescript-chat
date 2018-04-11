import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChatRoomComponent } from './create-chat-room.component';

describe('CreateChatRoomComponent', () => {
  let component: CreateChatRoomComponent;
  let fixture: ComponentFixture<CreateChatRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateChatRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChatRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
