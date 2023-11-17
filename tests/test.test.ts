// Mocking modules and dependencies
jest.mock("fs");
jest.mock("csv-parse");
jest.mock("next/server");

import { GET } from "./your-file"; // Replace 'your-file' with the actual path to your file
import { mocked } from "ts-jest/utils";
import { NextRequest } from "next/server";

describe("GET endpoint", () => {
	let mockRequest: NextRequest;

	beforeEach(() => {
		// Mocking NextRequest with necessary properties
		mockRequest = {
			nextUrl: new URL("http://example.com?sort=file-asc"),
		} as NextRequest;

		// Clear the mock implementation before each test
		mocked(fs.createReadStream).mockClear();
		mocked(parse).mockClear();
	});

	test("getData function", async () => {
		// Mocking the data for testing
		const mockData = [
			["2023-06-25 11:00", "1abc.txt"],
			["2023-06-25 12:00", "abc.txt"],
		];
		// Mocking the CSV parse function to return the mock data
		mocked(parse).mockImplementation((_options, callback) => {
			callback(null, mockData[0]);
			callback(null, mockData[1]);
			callback(null, null); // To simulate the end of parsing
		});

		// Running the getData function with mocked data
		const result = await getData();

		// Expecting the result to match the mock data
		expect(result).toEqual(mockData);
	});

	test("getLeadingNumbers function", () => {
		const result = getLeadingNumbers("123abc");
		expect(result).toBe(123);
	});

	test("sortByFile function", () => {
		const mockData = [
			["2023-06-25 11:00", "1abc.txt"],
			["2023-06-25 12:00", "abc.txt"],
		];
		const sortedDataAsc = [
			["2023-06-25 12:00", "abc.txt"],
			["2023-06-25 11:00", "1abc.txt"],
		];
		const sortedDataDesc = [
			["2023-06-25 11:00", "1abc.txt"],
			["2023-06-25 12:00", "abc.txt"],
		];

		const resultAsc = sortByFile(mockData, "asc");
		const resultDesc = sortByFile(mockData, "desc");

		expect(resultAsc).toEqual(sortedDataAsc);
		expect(resultDesc).toEqual(sortedDataDesc);
	});

	test("GET endpoint sorting by file in ascending order", async () => {
		// Mocking the data for testing
		const mockData = [
			["2023-06-25 11:00", "1abc.txt"],
			["2023-06-25 12:00", "abc.txt"],
		];
		mocked(fs.createReadStream).mockImplementation(() => ({
			pipe: jest.fn(),
			on: jest.fn().mockImplementation((event, callback) => {
				if (event === "data") {
					callback(mockData[0]);
					callback(mockData[1]);
				} else if (event === "end") {
					callback();
				}
			}),
		}));
		mocked(parse).mockImplementation((_options, callback) => {
			callback(null, mockData[0]);
			callback(null, mockData[1]);
			callback(null, null); // To simulate the end of parsing
		});

		// Running the GET function with mocked data and request
		const response = await GET(mockRequest);

		// Mocking the expected sorted output
		const expectedSortedData = [
			["2023-06-25 12:00", "abc.txt"],
			["2023-06-25 11:00", "1abc.txt"],
		];

		// Expecting the response to be a JSON string with the sorted data
		expect(response).toEqual(
			expect.objectContaining({
				body: JSON.stringify({ data: expectedSortedData }),
			})
		);
	});
});
