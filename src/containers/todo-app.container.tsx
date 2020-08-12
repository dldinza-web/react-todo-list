import React, { Component } from "react";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "../core/constants";
import TodoItemComponent from "../components/todo-item.component";
import FooterContainer from "./footer.container";

declare var Router : any;

export default class ToDoAppContainer extends Component<IAppProps, IAppState> {
  private refInputField :any

  constructor(props :IAppProps) {
    super(props)

    this.state = {
      nowShowing: ALL_TODOS,
      editing: null
    }

    this.refInputField = React.createRef();
  }

  componentDidMount() {
    let setState = this.setState

    let router = Router({
      '/':            setState.bind(this, { nowShowing: ALL_TODOS }),
      '/active':      setState.bind(this, { nowShowing: ACTIVE_TODOS }),
      '/completed':   setState.bind(this, { nowShowing: COMPLETED_TODOS })
    })

    router.init('/')
  }

  public handleNewTodoKeyDown(event :any) {
    if (event.keyCode !== ENTER_KEY) return;

    event.preventDefault();

    let value = this.refInputField.current.value.trim()

    if (value) {
      this.props.todoList.addTodo(value)
      this.refInputField.current.value = ''
    }
  }

  public toggleAll(event :any) {
    this.props.todoList.toggleAll(event.target.checked)
  }

  public toggle(todoToToggle :ITodoItem) {
    this.props.todoList.toggle(todoToToggle)
  }

  public destroy(todoToDestroy :ITodoItem) {
    this.props.todoList.destroy(todoToDestroy)
  }

  public edit(todoToEdit :ITodoItem) {
    this.setState({ editing: todoToEdit.id })
  }

  public save(todoToSave :ITodoItem, title :string) {
    this.props.todoList.save(todoToSave, title)
    this.setState({ editing: null })
  }

  public cancel() {
    this.setState({ editing: null })
  }

  public clearCompleted() {
    this.props.todoList.clearCompleted()
  }


  render() {
    let todos = this.props.todoList.todos;

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
