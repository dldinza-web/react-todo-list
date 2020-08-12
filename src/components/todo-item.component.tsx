import React, { Component } from "react";
import { ESCAPE_KEY, ENTER_KEY } from "../core/constants";

const classNames = require('classnames');

export default class TodoItemComponent extends Component<ITodoItemProps, ITodoItemState> {
  refInputField :any

  constructor(props :ITodoItemProps) {
    super(props)

    this.state = { itemTitle: this.props.todo.title }
    this.refInputField = React.createRef()
  }

  //this component render depends on the props passed as attributes
  public shouldComponentUpdate(nextProps :ITodoItemProps, nextState: ITodoItemState) {
    return (
      nextProps.todo !== this.props.todo
      || nextProps.editing !== this.props.editing
      || nextState.itemTitle !== this.state.itemTitle
    )
  }

  public componentDidUpdate(prevProps : any) {
    if (!prevProps.editing && this.props.editing) {
      this.refInputField.current.focus()
      this.refInputField.current.setSelectionRange(0, this.refInputField.current.value.length)
    }
  }


  public handleSubmit(event :any) {
    let itemTitle = this.state.itemTitle.trim()

    if (itemTitle) {
      this.props.onSave(itemTitle)
      this.setState({ itemTitle: itemTitle })
    } else {
      this.props.onDestroy()
    }
  }

  public handleEdit() {
    this.props.onEdit()
    this.setState({ itemTitle: this.props.todo.title })
  }

  public handleKeyDown(event :any) {
    if (event.which === ESCAPE_KEY) {
      this.setState({ itemTitle: this.props.todo.title })
      this.props.onCancel(event)
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit(event)
    }
  }

  public handleChange(event :any) {
    this.setState({ itemTitle: event.target.value })
  }

  public render() {
    return (
      <li className={classNames({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.props.onToggle}
          />
          <label onDoubleClick={ e => this.handleEdit() }>
            { this.props.todo.title }
          </label>
          <button className="destroy" onClick={ this.props.onDestroy } />
        </div>
        <input
          ref={this.refInputField}
          className="edit"
          value={this.state.itemTitle}

          onBlur={ e => this.handleSubmit(e) }
          onChange={ e => this.handleChange(e) }
          onKeyDown={ e => this.handleKeyDown(e) }
        />
      </li>
    )
  }
}
