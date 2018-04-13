/**
 * @license
 * Copyright © 2017-2018 OSIsoft, LLC. All rights reserved.
 * Use of this source code is governed by the terms in the accompanying LICENSE file.
 */
import { VisnavComponent } from './visnav.component';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing'
import { Component, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core';
import { testOutputPath } from '../../test-utils';

describe('Component: VisnavComponent', function () {

  @Component({
    selector: 'test-app',
    template: `
      <visnav #visnavComponent
        [fgColor]="fgColor"
        [bkColor]="bkColor"
        [data]="data"
        [pathPrefix]="pathPrefix"
      ></visnav>
    `
  })
  class TestHostComponent {
    @ViewChild('visnavComponent', { read: VisnavComponent })
    target: VisnavComponent;

    data: any;
    pathPrefix: string;
    fgColor: string = '#123456';
    bkColor: string = '#AA00BB';
  }

  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let component: VisnavComponent;

  beforeEach(async(() => {

  }));

  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports:      [ ],
      declarations: [ TestHostComponent, VisnavComponent ],
      providers:    [ ],
      schemas:      [ NO_ERRORS_SCHEMA ]
    })
    .overrideComponent(VisnavComponent, {
      // without the override, karma just attempts to load the html from http://localhost:9877/visnav.component.html
      set: {
        templateUrl: testOutputPath + 'visnav/visnav.component.html',
        styleUrls:  [testOutputPath + 'visnav/visnav.component.css']
      }
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(TestHostComponent);
      host = fixture.componentInstance;
      component = host.target;
      fixture.detectChanges();
    });
  });

   // very basic unit test visnav
   it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
