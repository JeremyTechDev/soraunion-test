import { NextRequest } from "next/server";

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const getAbsolutePath = (fileName: string) => {
	return path.join(process.cwd(), "public", fileName);
};

const getData = (): Promise<[string, string][]> => {
	return new Promise((resolve, reject) => {
		const data: [string, string][] = [];
		fs.createReadStream(getAbsolutePath("data.csv"))
			.pipe(parse({ delimiter: ";" }))
			.on("data", function (row: [string, string]) {
				data.push(row);
			})
			.on("end", function () {
				resolve(data);
			})
			.on("error", function (error: string) {
				reject(error);
			});
	});
};

function getLeadingNumbers(str: string) {
	const match = str.match(/^\d+/);

	return match ? Number(match[0]) : "";
}

export const sortByFile = (data: [string, string][], sortOrder = "asc") => {
	data.sort(function (a, b) {
		const fileA = a[1];
		const fileB = b[1];
		const filenameA = a[1].replace(/^0+/, "");
		const filenameB = b[1].replace(/^0+/, "");

		const convertedFilenameA = getLeadingNumbers(filenameA) || false;
		const convertedFilenameB = getLeadingNumbers(filenameB) || false;

		const compA = convertedFilenameA || fileA;
		const compB = convertedFilenameB || fileB;

		// Convert string representations of numbers to actual numbers for comparison
		const numA =
			typeof compA === "string" && !isNaN(compA as unknown as number)
				? parseFloat(compA)
				: compA;
		const numB =
			typeof compB === "string" && !isNaN(compB as unknown as number)
				? parseFloat(compB)
				: compB;

		const orderMultiplier = sortOrder === "asc" ? 1 : -1;
		if (typeof numA === "number" && typeof numB === "number") {
			return (numA - numB) * orderMultiplier;
		} else if (typeof numA === "string" && typeof numB === "string") {
			return String(numA).localeCompare(String(numB)) * orderMultiplier;
		} else {
			return typeof numA === "number" ? -1 : 1;
		}
	});

	return data;
};

export const GET = async (req: NextRequest) => {
	const data = await getData();
	const searchParams = req.nextUrl.searchParams;
	const sort = searchParams.get("sort");

	let output: [string, string][] = data;

	if (sort === "date-asc") {
		output = data.sort(function (a, b) {
			const dateA = new Date(a[0]);
			const dateB = new Date(b[0]);

			// @ts-ignore
			return dateA - dateB;
		});
	} else if (sort === "date-desc") {
		output = data.sort(function (a, b) {
			const dateA = new Date(a[0]);
			const dateB = new Date(b[0]);

			// @ts-ignore
			return (dateA - dateB) * -1;
		});
	} else if (sort === "file-asc") {
		output = sortByFile(data, "asc");
	} else if (sort === "file-desc") {
		output = sortByFile(data, "desc");
	}

	return new Response(JSON.stringify({ data: output }));
};
