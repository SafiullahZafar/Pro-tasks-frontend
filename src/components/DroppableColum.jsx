import { useDrop } from "react-dnd"
import DraggableTask from "./DraggableTask";

const DroppableColum = ({status,tasks,onDrop}) => {
    const [{isOver},drop]=useDrop(()=>({
        accept:'TASK',
        drop :(item)=>onDrop(item.id,status),
        collect :(monitor)=>({
            isOver:!!monitor.isOver(),
        }),
    }));
  return (
    <div
    ref={drop}
    className={`flex-1 bg-gray-100 p-4 rounded min-h-[300px] ${
        isOver?'bg-green-100':'bg-gray-100'
    }`}
    >
        <h3 className="font-bold mb-2 text-center">{status}</h3>
        {tasks.map((task)=>(
            <DraggableTask key={task._id} task={task} />
        ))}
    </div>
  )
}

export default DroppableColum;