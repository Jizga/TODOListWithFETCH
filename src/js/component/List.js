import React, { useEffect, useState } from "react";
import { Task } from "./Task";

export function List() {
	//Variables relacionadas con el fetch
	const url = "https://assets.breatheco.de/apis/fake/todos/user/Vivi";

	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	const [list, setList] = useState([]);
	const [inputTask, setInputTask] = useState("");

	useEffect(() => {
		fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
			//Obtener los datos en formato JSON
			.then(response => response.json())
			.then(
				data => {
					setIsLoaded(true);
					setList(data);
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

	const getInputValue = e => {
		setInputTask(e.target.value);
	};

	const addTask = newTask => {
		fetch(url, {
			method: "PUT",
			body: JSON.stringify(list),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => response.json())
			.then(
				data => {
					console.log("POST antes del if : ", data, typeof data);

					if (inputTask.trim() !== "") {
						setIsLoaded(true);

						//Aquí nuestros datos de los estados
						setList([
							...list,
							{
								id: Date.now(),
								label: newTask,
								done: false
							}
						]);

						console.log("POST data : ", data, typeof data);
					}
				},

				error => {
					setIsLoaded(true);
					setError(error);
				}
			)
			.catch(error => console.error("Error:", error));
	};

	const pressEnter = e => {
		if (inputTask.trim() !== "") {
			if (e.key === "Enter") {
				addTask(inputTask);
				setInputTask("");
			}
		}
	};

	return (
		<div className="container text-center mt-5 mb-5 pt-3 pb-5 d-flex justify-content-center rounded myListContainer">
			<div className="p-0 m-0 myContainer">
				<div className="row d-flex justify-content-center">
					<h1 className="col-12 mb-3 mt-2">TODO App</h1>
				</div>

				<div className="row mb-4 d-flex justify-content-center">
					<input
						className="col-9 border-0 rounded-pill text-center"
						type="text"
						onChange={e => getInputValue(e)}
						value={inputTask}
						onKeyPress={e => pressEnter(e)}
						placeholder="No tasks, add a task"
						autoFocus
					/>
				</div>

				<div className="row d-flex justify-content-center align-items-start">
					<div className="d-flex flex-column col-12">
						{list.map(task => {
							return (
								<Task
									key={task.id}
									id={task.id}
									taskText={task.label}
									done={task.done}
									// addTaskDone={}
									// deleteTask={} taskDoneList={} notDone={}
								/>
							);
						})}

						<div className="d-flex justify-content-start">
							<div className="taskNum">
								{list.length} tasks left
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
