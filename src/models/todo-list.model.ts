import Utils from "../core/utils"

export default class TodoListModel implements ITodoList {
  public key :string
  public todos :Array<ITodoItem>
  public onChanges :Array<any>

  constructor(key :string) {
    this.key = key
    this.todos = Utils.store(key)
    this.onChanges = []
  }

  public subscribe(onChange :any) {
    this.onChanges.push(onChange)
  }

  public inform() {
    Utils.store(this.key, this.todos)
    console.log(this.onChanges)
    this.onChanges.forEach((callback) => callback())
  }

  public addTodo(title :string) {
    this.todos = this.todos.concat({
      id: Utils.uuid(),
      title: title,
      completed: false
    })

    this.inform()
  }

  public toggleAll(checked :boolean) {
    this.todos = this.todos.map<ITodoItem>((todo :ITodoItem) =>
      Utils.extend({}, todo, { completed: checked })
    )

    this.inform()
  }

  public toggle(todoToTaggle :ITodoItem) {
    this.todos = this.todos.map<ITodoItem>((todo :ITodoItem) =>
      todoToTaggle !== todo ? todo :  Utils.extend({}, todo, { completed: !todo.completed })
    )

    this.inform()
  }

  public destroy(todoToDestroy :ITodoItem) {
    this.todos = this.todos.filter((todo :ITodoItem) => todoToDestroy !== todo)

    this.inform()
  }

  public save(todoToSave :ITodoItem, text :string) {
    this.todos = this.todos.map((todo :ITodoItem) =>
      todoToSave !== todo ? todo : Utils.extend({}, todo, { title: text })
    )

    this.inform()
  }

  public clearCompleted() {
    this.todos = this.todos.filter((todo :ITodoItem) => !todo.completed)

    this.inform()
  }
}
