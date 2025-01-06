const APIFeatures = require("../../Utils/apiFeatures");

describe("APIFeatures", () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    };
  });

  describe("filter method", () => {
    it("should exclude page, sort, and limit from the query string", () => {
      const queryString = { page: 1, sort: "name", limit: 10, name: "John" };
      const apiFeatures = new APIFeatures(mockQuery, queryString);

      apiFeatures.filter();

      expect(mockQuery.find).toHaveBeenCalledWith({ name: "John" });
    });

    it("should replace operators (gte, gt, lte, lt) with MongoDB equivalents", () => {
      const queryString = { age: { gte: 18, lte: 30 } };
      const apiFeatures = new APIFeatures(mockQuery, queryString);

      apiFeatures.filter();

      expect(mockQuery.find).toHaveBeenCalledWith({
        age: { $gte: 18, $lte: 30 },
      });
    });
  });

  describe("sort method", () => {
    it("should apply sorting based on query string sort field", () => {
      const queryString = { sort: "name,age" };
      const apiFeatures = new APIFeatures(mockQuery, queryString);

      apiFeatures.sort();

      expect(mockQuery.sort).toHaveBeenCalledWith("name age");
    });

    it("should apply default sorting by '-updatedAt' if no sort field is provided", () => {
      const queryString = {};
      const apiFeatures = new APIFeatures(mockQuery, queryString);

      apiFeatures.sort();

      expect(mockQuery.sort).toHaveBeenCalledWith("-updatedAt");
    });
  });

  describe("paginate method", () => {
    it("should apply pagination with default values for page and limit", () => {
      const queryString = {};
      const apiFeatures = new APIFeatures(mockQuery, queryString);

      apiFeatures.paginate();

      expect(mockQuery.skip).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(3);
    });

    it("should calculate skip and limit based on provided page and limit", () => {
      const queryString = { page: 2, limit: 5 };
      const apiFeatures = new APIFeatures(mockQuery, queryString);

      apiFeatures.paginate();

      expect(mockQuery.skip).toHaveBeenCalledWith(5);
      expect(mockQuery.limit).toHaveBeenCalledWith(5);
    });
  });
});
