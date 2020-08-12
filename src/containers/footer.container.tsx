import React, { Component } from "react";
import Utils from "../core/utils";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from "../core/constants";

const classNames = require('classnames');

export default class FooterContainer extends Component<ITodoFooterProps, {}> {
  public render() {
    let activeTodosWord = Utils.pluralize(this.props.count, 'item')
    let clearButton = null

    if (this.props.completedCount > 0) {
      clearButton = (
        <button
          className="clear-completed"
          onClick={ this.props.onClearCompleted }
        >
          Clear completed
        </button>
      )
    }

    let nowShowing = this.props.nowShowing

    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{ this.props.count }</strong> { activeTodosWord } left
        </span>

        <ul className="filters">
          <li>
            <a
              href="#/"
              className={classNames({ selected: nowShowing === ALL_TODOS })}
            >
              All
            </a>
          </li>
          &nbsp;
          <li>
            <a
              href="#/active"
              className={classNames({ selected: nowShowing === ACTIVE_TODOS })}
            >
              Active
            </a>
          </li>
          &nbsp;
          <li>
            <a
              href="#/completed"
              className={classNames({ selected: nowShowing === COMPLETED_TODOS })}
            >
              Completed
            </a>
          </li>
        </ul>

        { clearButton }
      </footer>
    )
  }
}
