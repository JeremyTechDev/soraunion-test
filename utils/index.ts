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
