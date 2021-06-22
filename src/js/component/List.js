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

	function getInputValue(e) {
		setInputTask(e.target.value);
	}

	async function getList() {
		try {
			let response = await fetch(url);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			} else {
				const fetchList = await response.json();

				fetchList.map(task =>
					task.done === false
						? addTaskToList(task)
						: addTaskToDoneList(task)
				);

				return fetchList;
			}
		} catch (e) {
			console.error(`error from database -- ${e}`);
		}
	}

	async function addTask(newTask) {
		console.log("función de añadir una nueva tarea");
	}

	function pressEnter(e) {
		if (inputTask.trim() !== "") {
			if (e.key === "Enter") {
				addTask(inputTask);
				setInputTask("");
			}
		}
	}

	function addTaskDone(idDone) {
		console.log("función de añadir tareas hechas");
	}

	function deleteTask(idTask) {
		console.log("función de borrar tarea seleccionada");
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
