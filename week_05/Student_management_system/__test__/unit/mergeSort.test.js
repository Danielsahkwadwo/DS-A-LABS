const mergeSort = require("../../helpers/mergeSort");

/**
 * Test cases for merge sort
 */
describe("merge sort", () => {
  it("should sort an array of objects in ascending order by the specified key", () => {
    // Arrange test data
    const input = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 22 },
      { name: "Charlie", age: 30 },
    ];
    const expectedOutput = [
      { name: "Bob", age: 22 },
      { name: "Alice", age: 25 },
      { name: "Charlie", age: 30 },
    ];

    const result = mergeSort(input, "age", "asc");
    expect(result).toEqual(expectedOutput);
  });

  it("should sort an array of objects in descending order by the specified key", () => {
    // Arrange test data
    const input = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 22 },
      { name: "Charlie", age: 30 },
    ];
    const expectedOutput = [
      { name: "Charlie", age: 30 },
      { name: "Alice", age: 25 },
      { name: "Bob", age: 22 },
    ];

    const result = mergeSort(input, "age", "desc");
    expect(result).toEqual(expectedOutput);
  });

  it("should return an empty array if the input array is empty", () => {
    const input = [];
    const result = mergeSort(input, "age", "asc");
    expect(result).toEqual([]);
  });

  it("should return the same array if it contains a single element", () => {
    const input = [{ name: "Alice", age: 25 }];
    const result = mergeSort(input, "age", "asc");
    expect(result).toEqual(input);
  });

  it("should handle sorting with non-numeric values", () => {
    // Arrange test data
    const input = [
      { name: "Charlie", age: 30 },
      { name: "Bob", age: 22 },
      { name: "Alice", age: 25 },
    ];
    const expectedOutput = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 22 },
      { name: "Charlie", age: 30 },
    ];

    const result = mergeSort(input, "name", "asc");
    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should handle sorting with duplicate values", () => {
    // Arrange test data
    const input = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 25 },
      { name: "Charlie", age: 30 },
    ];
    const expectedOutput = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 25 },
      { name: "Charlie", age: 30 },
    ];

    const result = mergeSort(input, "age", "asc");
    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
