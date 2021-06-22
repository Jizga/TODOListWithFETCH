import React, { useEffect, useState } from "react";
import { Task } from "./Task";

export function List() {
	const url = "https://assets.breatheco.de/apis/fake/todos/user/jizga";

	const [inputTask, setInputTask] = useState("");
	const [list, setList] = useState([]);
	const [listDone, setListDone] = useState([]);

	useEffect(() => {
		getList();
	}, []);

	async function getList() {
		await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => response.json())

			.then(data => {
				if (data) {
					data.map(task =>
						task.done === false
							? addTaskToList(task)
							: addTaskToDoneList(task)
					);
				} else {
					console.log("Error in data");
				}
			})
			.catch(error => console.error("Error:", error));
	}

	function getInputValue(e) {
		setInputTask(e.target.value);
	}

	//***** FUNCIÓN PARA HACER BIEN LAS ACTUALIZACIONES DE LA LISTA DE PENDIENTES */
	function addTaskToList(newTask) {
		// Parece ser que asi es como se añaden cosas en React cuando quieres meterle algo a un array
		// prevList es lo que hay antes de meter la Task
		// Los set del useState parece ser que no son inmediatos, simplemente lo pone en cola y ya lo hara cuando
		// él quiera, por eso antes solo metía el último
		setList(prevList => [...prevList, newTask]);
	}

	//***** FUNCIÓN PARA HACER BIEN LAS ACTUALIZACIONES DE LA LISTA DE COMPLETADOS*/
	function addTaskToDoneList(newDoneTask) {
		setListDone(prevDoneList => [...prevDoneList, newDoneTask]);
	}

	async function addTask(newTask) {
		// "newList" -->>>> undefined ?¿?¿?¿?

		let newList = addTaskToList({
			id: Date.now(),
			label: newTask,
			done: false
		});

		console.log("newList antes del fetch : ", newList);

		await fetch(url, {
			method: "PUT",
			body: JSON.stringify(newList),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => response.json())
			.catch(error => console.error("Error:", error))
			.then(data => console.log("Success:", data));
		console.log("newList en el fetch : ", newList);
	}

	function pressEnter(e) {
		if (inputTask.trim() !== "") {
			if (e.key === "Enter") {
				addTask(inputTask);
				setInputTask("");
			}
		}
	}

	function deleteTask(idTask) {
		//La actualización de la lista debe de ser antes del fetch
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
			.then(data =>
				data
					? console.log("Data is ok: ", data)
					: console.error(
							`The error in data was a ${Response.status}`
					  )
			)
			.catch(error => console.error("Error:", error));
	}

	function addTaskDone(idDone) {
		fetch(url, {
			method: "PUT",
			body: JSON.stringify(listDone),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => response.json())
			.then(data => {
				if (data) {
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
				} else {
					console.log("Error in data");
				}
			})
			.catch(error => console.error("Error:", error));
	}

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
