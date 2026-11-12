type TaskProps = {
  id: number
  task: string
  onDelete: (taskId: number) => void
}

// sem memo()
export function Task({ id, task, onDelete }: TaskProps) {
  // Experiência 3: descomenta a linha abaixo para tirar ESTE componente do Compiler
  // 'use no memo'

  console.log('Rendering <Task />', task)

  return (
    <li>
      {task} <button onClick={() => onDelete(id)}>X</button>
    </li>
  )
}
