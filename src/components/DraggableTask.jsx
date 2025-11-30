import { useDrag } from "react-dnd";

const DraggableTask = ({task}) => {
    const [{isDragging},drag] =useDrag(()=>({
        type : 'TASK',
        item : {id:task._id},
        collect:(monitor)=>({
            isDragging:!!monitor.isDragging(),
        }),
    }));
  return (
    <div
    ref={drag}
    className={`p-2 mb-3 shadow rounded bg-white cursor-move ${
        isDragging? 'opacity-50' : 'opacity-100'
    }`}
    >
        <h3 className="font-bold">{task.title}</h3>
        <p> {task.description} </p>
    </div>
  )
}

export default DraggableTask;
