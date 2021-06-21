import React, { useEffect, useState } from "react";
import { Task } from "./Task";

export function List() {
	//Variables relacionadas con el fetch
	const url = "https://assets.breatheco.de/apis/fake/todos/user/jizga";

	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	const [list, setList] = useState([]);
	const [inputTask, setInputTask] = useState("");

	useEffect(() => {
		getList();
	}, []);

	const getList = () => {
		fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => response.json())
			.then(
				data => {
					setIsLoaded(true);
					setList(data);
				},

				error => {
					setIsLoaded(true);
					setError(error);
				}
			)
			.catch(error => console.error("Error:", error));
	};

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
					if (inputTask.trim() !== "") {
						setIsLoaded(true);
						setList([
							...list,
							{
								id: Date.now(),
								label: newTask,
								done: false
							}
						]);
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

	const deleteTask = idTask => {
		//La actualización de la lista debe de ser antes
		setList(list.filter(task => task.id !== idTask));

		fetch(url, {
			method: "PUT", //El método DELETE de esta api lo borra todo, usuario incluido
			//El PUT está funcionando regular, actualiza la lista en la BD cuando se ha borrado o añadido dos tareas, borrando o añadiendo la primera de ellas
			body: JSON.stringify(list),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => response.json())
			.then(
				data => {
					setIsLoaded(true);
				},
				error => {
					setIsLoaded(true);
					setError(error);
				}
			)
			.catch(error => console.error("Error:", error));
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
									deleteTask={deleteTask}
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
