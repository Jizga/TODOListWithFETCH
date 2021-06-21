import React, { useEffect, useState } from "react";
import { Task } from "./Task";

export function List() {
	//Variables relacionadas con el fetch
	const url = "https://assets.breatheco.de/apis/fake/todos/user/Vivi";
	const options = {
		method: "GET",
		// body: JSON.stringify(data), // GET no lleva body
		headers: {
			"Content-Type": "application/json"
		}
	};

	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	// ----------------------------------------------------------

	const [list, setList] = useState([]);
	const [inputTask, setInputTask] = useState("");

	useEffect(() => {
		fetch(url, options)
			//Obtener los datos en formato JSON
			.then(res => res.json())
			.then(
				result => {
					setIsLoaded(true);
					setList(result);
				},
				// Nota: es importante manejar errores aquí y no en
				// un bloque catch() para que no interceptemos errores
				// de errores reales en los componentes.
				error => {
					setIsLoaded(true);
					setError(error);
				}
			)
			.catch(error => console.error("Error:", error));
	}, []);

	console.log("LISTA : ", list, typeof list);

	return (
		<div className="container text-center mt-5 mb-5 pt-3 pb-5 d-flex justify-content-center rounded myListContainer">
			<div className="p-0 m-0 myContainer">
				<div className="row d-flex justify-content-center">
					<h1 className="col-9 col-sm-10 col-md-10 col-lg-12 col-xl-12 mb-3 mt-2">
						TODO App
					</h1>
				</div>

				<div className="row mb-4 d-flex justify-content-center">
					<input
						className="col-9 col-sm-10 col-md-10 col-lg-12 col-xl-12 border-0 rounded-pill text-center"
						type="text"
						onChange={e => setInputTask(e.target.value)}
						value={inputTask}
						// onKeyPress={e => pressEnter(e)}
						placeholder="No tasks, add a task"
						autoFocus
					/>
				</div>

				<div className="row d-flex justify-content-center align-items-start">
					<div className="d-flex flex-column col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
						<h4 className="col-8 col-sm-9 col-md-9 col-lg-12 col-xl-12 taskTitle">
							To do tasks
						</h4>
						{list.map(task => {
							return (
								<Task
									key={task.id}
									id={task.id}
									taskText={task.label}
									done={task.done}
									// addTaskDone={} deleteTask={} taskDoneList={} notDone={}
								/>
							);
						})}

						<div className="d-flex justify-content-start">
							<div className="taskNum">
								{list.length} tasks left
							</div>
						</div>
					</div>

					{/* <div className="d-flex flex-column col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <h4 className="col-8 col-sm-9 col-md-9 col-lg-12 col-xl-12 taskTitle">
                            Done tasks
						</h4>
                        {taskDoneList.map(task => {
                            return (
                                <Task
                                    key={task.id}
                                    id={task.id}
                                    taskText={task.text}
                                    done={task.done}
                                    deleteTask={deleteTask}
                                    addTaskDone={addTaskDone}
                                    taskDoneList={taskDoneList}
                                    dontDone={dontDone}
                                />
                            );
                        })}

                        <div className="d-flex justify-content-start">
                            <div className="taskNum">
                                {taskDoneList.length} tasks done
							</div>
                        </div>
                    </div> */}
				</div>
			</div>
		</div>
	);
}
