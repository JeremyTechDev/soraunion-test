const sortByFile = require("./route");

describe("sortByFile function", () => {
	test("should sort data in ascending order by default", () => {
		const data = [
			["2023-06-25 11:00", "1abc.txt"],
			["2023-06-25 12:00", "abc.txt"],
		];
		const expectedSortedData = [
			["2023-06-25 12:00", "abc.txt"],
			["2023-06-25 11:00", "1abc.txt"],
		];

		const result = sortByFile(data);

		expect(result).toEqual(expectedSortedData);
	});

	test("should sort data in ascending order", () => {
		const data = [
			["2023-06-25 11:00", "1abc.txt"],
			["2023-06-25 12:00", "abc.txt"],
		];
		const expectedSortedData = [
			["2023-06-25 12:00", "abc.txt"],
			["2023-06-25 11:00", "1abc.txt"],
		];

		const result = sortByFile(data, "asc");

		expect(result).toEqual(expectedSortedData);
	});

	test("should sort data in descending order", () => {
		const data = [
			["2023-06-25 11:00", "1abc.txt"],
			["2023-06-25 12:00", "abc.txt"],
		];
		const expectedSortedData = [
			["2023-06-25 11:00", "1abc.txt"],
			["2023-06-25 12:00", "abc.txt"],
		];

		const result = sortByFile(data, "desc");

		expect(result).toEqual(expectedSortedData);
	});

	test("should handle leading numbers in filenames", () => {
		const data = [
			["2023-06-25 11:00", "1abc.txt"],
			["2023-06-25 12:00", "02abc.txt"],
			["2023-06-25 13:00", "abc.txt"],
		];
		const expectedSortedData = [
			["2023-06-25 13:00", "abc.txt"],
			["2023-06-25 02:00", "02abc.txt"],
			["2023-06-25 11:00", "1abc.txt"],
		];

		const result = sortByFile(data);

		expect(result).toEqual(expectedSortedData);
	});

	test("should handle non-numeric filenames", () => {
		const data = [
			["2023-06-25 11:00", "abc.txt"],
			["2023-06-25 12:00", "def.txt"],
		];
		const expectedSortedData = [
			["2023-06-25 11:00", "abc.txt"],
			["2023-06-25 12:00", "def.txt"],
		];

		const result = sortByFile(data);

		expect(result).toEqual(expectedSortedData);
	});
});
