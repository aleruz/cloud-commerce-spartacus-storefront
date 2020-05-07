import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule, Order, OrderEntry } from '@spartacus/core';
import { of } from 'rxjs';
import { OrderAmendService } from '../../amend-order.service';
import { ReturnOrderConfirmationComponent } from './return-order-confirmation.component';
import createSpy = jasmine.createSpy;

@Component({
  template: '',
  selector: 'cx-amend-order-actions',
})
class MockAmendOrderActionComponent {
  @Input() orderCode: string;
  @Input() amendOrderForm: FormGroup;
  @Input() backRoute: string;
  @Input() forwardRoute: string;
}

@Component({
  template: '',
  selector: 'cx-amend-order-items',
})
class MockCancelOrReturnItemsComponent {
  @Input() entries: OrderEntry[];
  @Input() isConfirmation = false;
}

const mockOrder: Order = {
  code: '123',
  entries: [{ entryNumber: 0 }, { entryNumber: 3 }],
  created: new Date('2019-02-11T13:02:58+0000'),
  cancellable: true,
};
const mockForm: FormGroup = new FormGroup({});
const entryGroup = new FormGroup({});
mockForm.addControl('entries', entryGroup);
mockForm.addControl('orderCode', new FormControl(mockOrder.code));
mockOrder.entries.forEach((entry) => {
  const key = entry.entryNumber.toString();
  entryGroup.addControl(key, new FormControl(0));
});

class MockOrderAmendService {
  save = createSpy();
  getForm() {
    return of(mockForm);
  }
  getAmendedEntries() {
    return of(mockOrder.entries);
  }
}

describe('ReturnOrderConfirmationComponent', () => {
  let component: ReturnOrderConfirmationComponent;
  let fixture: ComponentFixture<ReturnOrderConfirmationComponent>;
  let service: OrderAmendService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, I18nTestingModule, ReactiveFormsModule],
      providers: [
        { provide: OrderAmendService, useClass: MockOrderAmendService },
      ],
      declarations: [
        ReturnOrderConfirmationComponent,
        MockAmendOrderActionComponent,
        MockCancelOrReturnItemsComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnOrderConfirmationComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(OrderAmendService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an order code', () => {
    fixture.detectChanges();
    component.form$.subscribe().unsubscribe();
    expect(component.orderCode).toEqual('123');
  });

  it('should get cancelled entries', () => {
    let entries: OrderEntry[];
    component.entries$.subscribe((value) => (entries = value)).unsubscribe();
    expect(entries).toEqual([{ entryNumber: 0 }, { entryNumber: 3 }]);
  });

  it('should delegate form submission to service', () => {
    component.submit(mockForm);
    expect(service.save).toHaveBeenCalled();
  });

  it('should disable form after submit', () => {
    component.submit(mockForm);
    expect(mockForm.disable).toBeTruthy();
  });
});
