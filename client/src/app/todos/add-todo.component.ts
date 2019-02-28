import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {Todo} from './todo';


@Component({
  selector: 'add-todo.component',
  templateUrl: 'add-todo.component.html',
})
export class AddTodoComponent implements OnInit {

  addTodoForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { todo: Todo }, private fb: FormBuilder) {
  }

  createForms() {

    this.addTodoForm = this.fb.group({
      // We allow alphanumeric input and limit the length for name.
      user: new FormControl('user', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ])),
      status: new FormControl('status'),
      body: new FormControl('body'),
      category: new FormControl('category')
    })

  }

  ngOnInit() {
    this.createForms();
  }

}
