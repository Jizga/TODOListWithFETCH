import React, { useEffect, useState } from "react";
import { Task } from "./Task";

export function List() {
	const url = "https://assets.breatheco.de/apis/fake/todos/user/Vivi";
	const options = {
		method: "GET",
		// body: JSON.stringify(data), // GET no lleva body
		headers: {
			"Content-Type": "application/json"
		}
	};

	const [list, setList] = useState([]);

	useEffect(() => {
		fetch(url, options)
			.then(res => res.json())
			.then(response => {
				//Obtener la lista como un array de objetos (formato JSON)
				setList(JSON.stringify(response));
			})
			.catch(error => console.error("Error:", error));
	}, []);

	return (
		<div>
			{list}
			<Task />
		</div>
	);
}
