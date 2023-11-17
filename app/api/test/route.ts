import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import { sortByFile } from "@/utils";

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
