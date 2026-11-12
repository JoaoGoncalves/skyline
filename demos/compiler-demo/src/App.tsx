import { useState, type SubmitEvent } from 'react'
import { List } from './List'
import { initialTodos, type Todo } from './todos'

// Uma lista de tarefas SEM memo, useMemo nem useCallback.
// Com o React Compiler ligado, o comportamento é o da versão otimizada à mão.
export default function App() {
  const [todoList, setTodoList] = useState<Todo[]>(initialTodos)
  const [task, setTask] = useState('')
  const [term, setTerm] = useState('')

  console.log('Rendering <App />')

  function handleCreate(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!task.trim()) return
    setTodoList([...todoList, { id: Date.now(), task }])
    setTask('')
  }

  // sem useCallback: uma função nova em cada render
  function handleDelete(taskId: number) {
    setTodoList(todoList.filter((todo) => todo.id !== taskId))
  }

  // sem useMemo: recalculado em cada render
  const filteredTodoList = todoList.filter((todo) => {
    console.log('Filtering...')
    return todo.task.toLowerCase().includes(term.toLowerCase())
  })

  return (
    <main>
      <h1>React Compiler demo</h1>
      <p className="hint">
        Escreve no campo e conta os logs na consola. Depois corre o outro script e compara.
      </p>

      <form onSubmit={handleCreate}>
        <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="New task or search term" />
        <button type="submit">Create</button>
        <button type="button" onClick={() => setTerm(task)}>
          Search
        </button>
        <button type="button" onClick={() => setTerm('')}>
          Show all
        </button>
      </form>

      <List todoList={filteredTodoList} onDelete={handleDelete} />
    </main>
  )
}
