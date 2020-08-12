import Utils from "../core/utils"

export default class TodoListModel implements ITodoList {
  public key :string
  public todos :Array<ITodoItem>

  constructor(key :string) {
    this.key = key
    this.todos = Utils.store(key)
  }

  public updateStore() {
    Utils.store(this.key, this.todos)
  }

  public addTodo(title :string) {
    this.todos = this.todos.concat({
      id: Utils.uuid(),
      title: title,
      completed: false
    })

    this.updateStore()
  }

  public toggleAll(checked :boolean) {
    this.todos = this.todos.map<ITodoItem>((todo :ITodoItem) =>
      Utils.extend({}, todo, { completed: checked })
    )

    this.updateStore()
  }

  public toggle(todoToTaggle :ITodoItem) {
    this.todos = this.todos.map<ITodoItem>((todo :ITodoItem) =>
      todoToTaggle !== todo ? todo :  Utils.extend({}, todo, { completed: !todo.completed })
    )

    this.updateStore()
  }

  public destroy(todoToDestroy :ITodoItem) {
    this.todos = this.todos.filter((todo :ITodoItem) => todoToDestroy !== todo)

    this.updateStore()
  }

  public save(todoToSave :ITodoItem, text :string) {
    this.todos = this.todos.map((todo :ITodoItem) =>
      todoToSave !== todo ? todo : Utils.extend({}, todo, { title: text })
    )

    this.updateStore()
  }

  public clearCompleted() {
    this.todos = this.todos.filter((todo :ITodoItem) => !todo.completed)

    this.updateStore()
  }
}
