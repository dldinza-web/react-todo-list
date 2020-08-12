// Todo Item
interface ITodoItem {
  id: string,
  title: string,
  completed: boolean
}

interface ITodoItemProps {
  key: string
  todo: ITodoItem
  editing?: boolean

  onSave: (val: any) => void
  onDestroy: () => void
  onEdit: () => void
  onCancel: (event: any) => void
  onToggle: () => void
}

interface ITodoItemState {
  itemTitle: string
}

// Footer

interface ITodoFooterProps {
  completedCount: number
  onClearCompleted: any
  nowShowing: string
  count: number
}

// Todo Main Model
interface ITodoList {
  key: any
  todos: Array<ITodoItem>
  onChanges: Array<any>

  subscribe(onChange)
  inform()
  addTodo(title :string)
  toggleAll(checked :boolean)
  toggle(todoToToggle)
  destroy(todo :ITodoItem)
  save(todoToSave, text)
  clearCompleted()
}

// Main App

interface IAppProps {
  todoList :ITodoList
}

interface IAppState {
  editing? :string | null,
  nowShowing :string
}
