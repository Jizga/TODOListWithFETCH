import React, { useEffect, useState } from "react";
import { Task } from "./Task";

export function List() {
	//Variables relacionadas con el fetch
	const url = "https://assets.breatheco.de/apis/fake/todos/user/jizga";

	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	const [inputTask, setInputTask] = useState("");
	const [list, setList] = useState([]);
	const [listDone, setListDone] = useState([]);

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
					data.map(task =>
						task.done === false
							? addTaskToList(task)
							: addTaskToDoneList(task)
					);
				},

				error => {
					setError(error);
				}
			)
			.catch(error => console.error("Error:", error))
			.finally(setIsLoaded(true));
	};

	const getInputValue = e => {
		setInputTask(e.target.value);
	};

	const addTaskToList = newTask => {
		// Parece ser que asi es como se añaden cosas en React cuando quieres meterle algo a un array
		// prevList es lo que hay antes de meter la Task
		// Los setStates parece ser que no son inmediatos, simplemente lo pone en cola y ya lo hara cuando
		// le pete, por eso antes solo metía el ultimo
		setList(prevList => [...prevList, newTask]);
	};

	const addTaskToDoneList = newDoneTask => {
		setListDone(prevDoneList => [...prevDoneList, newDoneTask]);
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

	const addTaskDone = idDone => {
		fetch(url, {
			method: "PUT",
			body: JSON.stringify(listDone),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => response.json())
			.then(
				data => {
					setIsLoaded(true);

					if (listDone !== []) {
						//lista de tareas hechas actualizada con la tarea hecha
						let taskDone = list.filter(task => {
							if (task.id === idDone) {
								task.done = true;

								setListDone([...listDone, taskDone]);

								let listWithoutTaskDone = list.filter(
									task => task.id !== idDone
								);

								console.log("taskDone : ", taskDone);

								//Lista de tareas pendientes actualizada
								setList(listWithoutTaskDone);

								console.log("lista pendientes : ", list);
							}
						});
					}
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
					<div className="d-flex flex-column col-6">
						<h4 className="col-12 taskTitle">Tasks to do</h4>
						{list.map(task => {
							return (
								<Task
									key={task.id}
									id={task.id}
									taskText={task.label}
									done={task.done}
									deleteTask={deleteTask}
									addTaskDone={addTaskDone}
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

				<div className="row d-flex justify-content-center align-items-start">
					<div className="d-flex flex-column col-6">
						<h4 className="col-12 taskTitle">Done tasks</h4>
						{listDone.map(task => {
							return (
								<Task
									key={task.id}
									id={task.id}
									taskText={task.label}
									done={task.done}
									deleteTask={deleteTask}
									addTaskDone={addTaskDone}
								/>
							);
						})}

						<div className="d-flex justify-content-start">
							<div className="taskNum">
								{listDone.length} tasks done
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
