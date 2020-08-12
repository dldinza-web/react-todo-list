import React, { Component } from "react";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "../core/constants";
import TodoItemComponent from "../components/todo-item.component";
import FooterContainer from "./footer.container";
import TodoListModel from "../models/todo-list.model";

declare var Router : any;

export default class ToDoAppContainer extends Component<{}, IAppState> {
  private refInputField :any

  constructor(props: any) {
    super(props)

    this.state = {
      nowShowing: ALL_TODOS,
      editing: null,
      todoList: new TodoListModel('react-todos')
    }

    this.refInputField = React.createRef();
  }

  componentDidMount() {
    let setState = this.setState

    let router = Router({
      '/':            setState.bind(this, { ...this.state, nowShowing: ALL_TODOS }),
      '/active':      setState.bind(this, { ...this.state, nowShowing: ACTIVE_TODOS }),
      '/completed':   setState.bind(this, { ...this.state, nowShowing: COMPLETED_TODOS })
    })

    router.init('/')
  }

  public handleNewTodoKeyDown(event :any) {
    if (event.keyCode !== ENTER_KEY) return;

    event.preventDefault();

    let value = this.refInputField.current.value.trim()

    if (value) {
      this.state.todoList.addTodo(value)
      this.refInputField.current.value = ''

      this.refreshState()
    }
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return nextProps !== this.props || nextState !== this.state
  }

  private refreshState(attibutes :Object = {}) {
    this.setState({ ...this.state, ...attibutes })
  }

  public toggleAll(event :any) {
    this.state.todoList.toggleAll(event.target.checked)
  }

  public toggle(todoToToggle :ITodoItem) {
    this.state.todoList.toggle(todoToToggle)

    this.refreshState()
  }

  public destroy(todoToDestroy :ITodoItem) {
    this.state.todoList.destroy(todoToDestroy)

    this.refreshState()
  }

  public edit(todoToEdit :ITodoItem) {
    this.refreshState({ editing: todoToEdit.id })
  }

  public save(todoToSave :ITodoItem, title :string) {
    this.state.todoList.save(todoToSave, title)

    this.refreshState({ editing: null })
  }

  public cancel() {
    this.refreshState({ editing: null })
  }

  public clearCompleted() {
    this.state.todoList.clearCompleted()

    this.refreshState()
  }


  render() {
    let todos = this.state.todoList.todos;

    let todoItems = todos.filter( (todo) => {
      switch (this.state.nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
      }
    }, this);

    let todoItemsComponents = todoItems.map((todoItem) => {
      return (
        <TodoItemComponent
          key={todoItem.id}
          todo={ todoItem }

          onToggle={ this.toggle.bind(this, todoItem) }
          onDestroy={ this.destroy.bind(this, todoItem) }
          onEdit={this.edit.bind(this, todoItem)}
          editing={this.state.editing === todoItem.id}
          onSave={this.save.bind(this, todoItem)}
          onCancel={ e => this.cancel() }
        />
      )
    }, this)

    let activeCount = todoItems.reduce((acum, todoItem) => {
      return todoItem.completed ? acum : acum + 1
    }, 0)

    let completedCount = todoItems.length - activeCount

    let footerComponent = null
    if (activeCount || completedCount) {
      footerComponent =
        <FooterContainer
          count={ activeCount }
          completedCount={ completedCount }
          nowShowing={ this.state.nowShowing }
          onClearCompleted={ (e :any) => this.clearCompleted() }
        />
    }

    let toggleAllComponent = null
    if (todos.length) {
      toggleAllComponent = (
        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            onChange={ e => this.toggleAll(e) }
            checked={activeCount === 0}
          />
          <ul className="todo-list">
            {todoItemsComponents}
          </ul>
        </section>
      );
    }

    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          <input
            ref={this.refInputField}
            className="new-todo"
            placeholder="What needs to be done?"
            onKeyDown={ (e :any) => this.handleNewTodoKeyDown(e) }
            autoFocus={true}
          />
        </header>
        {toggleAllComponent}
        {footerComponent}
      </div>
    )
  }
}
