import React, { useState, useEffect } from "react";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import { FaTrash } from "react-icons/fa";

function App() {
  const [tasks, setTasks] = useState("");
  const [output, setOutput] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get("http://localhost:5000/get")
      .then((result) => {
        if (result.data.length === 0) {
          setOutput([{ task: "No tasks left!" }]);
        } else {
          setOutput(result.data);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleInputChange = (e) => {
    setTasks(e.target.value);
  };

  const handleCheckboxClick = (id) => {
    const updatedTasks = output.map((task) =>
      task._id === id ? { ...task, checked: !task.checked } : task
    );
    setOutput(updatedTasks);
    axios
      .put(`http://localhost:5000/update/${id}`, {
        checked: !output.find((task) => task._id === id).checked,
      })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
    fetchTasks();
  };
const handledelete=(id)=>{
axios.delete(`http://localhost:5000/delete/${id}`)
.then(result=>console.log(result))
.catch(err=>console.log(err))
fetchTasks();
}
  const go = () => {
    if (tasks.trim() !== "") {
      axios
        .post("http://localhost:5000/add", { task: tasks })
        .then(() => {
          fetchTasks(); // Fetch the updated tasks after adding a new task
          setTasks(""); // Clear input field after adding task
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <div className="bg-amber-300 m-0 p-0 h-full w-full min-h-screen">
        <h1 className="text-3xl font-bold underline text-center justify-center p-3">
          Do's & Done
        </h1>
        <div className="flex flex-col bg-lime-300 w-2/5 h-full min max-h-screen text-center justify-center mx-auto my-20 border-solid border-black rounded p-3">
          <h1 className="text-xl font-bold underline p-3">
            Work to be completed!
          </h1>
          <div className="flex flex-row">
            <input
              type="text"
              placeholder="Enter the task"
              value={tasks}
              onChange={handleInputChange}
              className="w-4/5 h-10 mx-5 border-solid border-black p-3 text-black font-semibold"
            />
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={go}
            >
              GO
            </button>
          </div>
          <div className="flex flex-col">
            {output.map((task, index) => (
              <div
                key={task._id || index}
                className="flex flex-row m-2 space-x-2"
              >
                {task.done ? (
                  <>
                    <Checkbox
                      color="primary"
                      checked={true} // Set checkbox to always checked
                      disabled={true} // Disable checkbox to prevent changes
                    />
                    <h1 className="text-semibold text-green-700 p-3 w-4/5 bg-black text-center justify-center">
                      {task.task}
                    </h1>
                  </>
                ) : (
                  <>
                    <Checkbox
                      color="primary"
                      onClick={() => handleCheckboxClick(task._id)}
                    />
                    <h1 className="text-semibold text-white p-3 w-4/5 bg-black text-center justify-center">
                      {task.task}
                    </h1>
                    <FaTrash className="cursor-pointer size-6 my-3"  onClick={()=>handledelete(task._id)}/>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
