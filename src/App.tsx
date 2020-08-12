import React, { Component } from 'react';
import './App.css';
import ToDoAppContainer from './containers/todo-app.container';
import TodoListModel from './models/todo-list.model';

export default class App extends Component {
  render() {
    return (
      <ToDoAppContainer />
    )
  }
}
