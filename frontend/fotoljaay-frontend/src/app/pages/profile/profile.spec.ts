import { TestBed } from '@angular/core/testing';
import { Profile } from './profile';

describe('Profile', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Profile);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
