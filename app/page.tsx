"use client";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useEffect, useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";

export default function Test() {
	const [sort, setSort] = useState("");
	const [data, setData] = useState([]);

	useEffect(() => {
		async function fetchData() {
			console.log("sort", sort);
			const res = await fetch(`/api/test?sort=${sort}`);
			console.log(res);
			const json = await res.json();
			setData(json?.data);
		}

		fetchData();
	}, [sort]);

	const handleChange = (event: SelectChangeEvent) => {
		console.log("event.target.value", event.target.value);
		setSort(event.target.value as string);
	};

	return (
		<Box sx={{ margin: '0 auto',  maxWidth: 660 }}>
			<FormControl fullWidth>
				<InputLabel id="select-sort">Sort By</InputLabel>
				<Select
					labelId="select-sort"
					id="demo-sort-select"
					value={sort}
					label="Sort By"
					onChange={handleChange}
				>
					<MenuItem value="date-asc">Date ASC</MenuItem>
					<MenuItem value="date-desc">Date DESC</MenuItem>
					<MenuItem value="file-asc">Filename ASC</MenuItem>
					<MenuItem value="file-desc">Filename DESC</MenuItem>
				</Select>
			</FormControl>

			<List>
				{data?.map(([date, file], i) => (
					<ListItem key={file}>
						<ListItemText primary={i + 1} />
						<ListItemText primary={date} />
						<ListItemText primary={file} />
					</ListItem>
				))}
			</List>
		</Box>
	);
}
