import React, { useEffect, useState } from "react";
import { Task } from "./Task";

export function List() {
	const url = "https://assets.breatheco.de/apis/fake/todos/user/jizga";

	const [inputTask, setInputTask] = useState("");
	const [list, setList] = useState([]);

	useEffect(() => {
		getList();
	}, []);

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

				setList(fetchList);
			}
		} catch (e) {
			console.error(`error from database -- ${e}`);
		}
	}

	async function addTask(newTask) {
		const newList = [
			...list,
			{
				id: Date.now(),
				label: newTask,
				done: false
			}
		];

		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newList)
		};

		try {
			await fetch(url, requestOptions);
			await getList();
		} catch (error) {
			console.error(error);
		}
	}

	function pressEnter(e) {
		if (inputTask.trim() !== "") {
			if (e.key === "Enter") {
				addTask(inputTask);
				setInputTask("");
			}
		}
	}

	async function addTaskDone(idDone) {
		let newList = list.map(task => {
			if (task.id === idDone) {
				task.done = true;
			}

			return task;
		});

		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newList)
		};

		try {
			await fetch(url, requestOptions);
			await getList();
		} catch (error) {
			console.error(error);
		}
	}

	async function deleteTask(idTask) {
		let newList = list.filter(task => task.id !== idTask);

		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newList)
		};

		try {
			await fetch(url, requestOptions);
			await getList();
		} catch (error) {
			console.error(error);
		}
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
						{list
							.filter(task => task.done === false)
							.map(task => {
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
								{
									list.filter(task => task.done === false)
										.length
								}{" "}
								tasks left
							</div>
						</div>
					</div>

					<div className="d-flex flex-column col-6">
						<h4 className="col-12 taskTitle">Done tasks</h4>
						{list
							.filter(task => task.done === true)
							.map(task => {
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
								{list.filter(task => task.done === true).length}{" "}
								tasks done
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
