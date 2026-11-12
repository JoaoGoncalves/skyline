import { Task } from './Task'
import type { Todo } from './todos'

type ListProps = {
  todoList: Todo[]
  onDelete: (taskId: number) => void
}

// sem memo()
export function List({ todoList, onDelete }: ListProps) {
  console.log('Rendering <List />')

  return (
    <ul>
      {todoList.map((todo) => (
        <Task key={todo.id} id={todo.id} task={todo.task} onDelete={onDelete} />
      ))}
    </ul>
  )
}
