class APIFeatures {
  /**
   * @param {Query}   query        A Mongoose query (e.g. Model.find())
   * @param {Object}  queryString  The raw req.query
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = { ...queryString }; // for select/sort/page/limit

    // purely for filtering, removed duplicate keys
    this.filterParams = { ...queryString };
    ["select", "sort", "page", "limit"].forEach(
      (f) => delete this.filterParams[f]
    );

    // pagination metadata
    this.page = 1;
    this.limit = 25;
  }

  filter() {
    // convert { price: { lte: '100' } } → { price: { $lte: 100 } }
    const str = JSON.stringify(this.filterParams).replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (m) => `$${m}`
    );

    let filterObj;
    try {
      filterObj = JSON.parse(str);
    } catch (err) {
      const parseError = new Error("Invalid filter query parameters");
      parseError.statusCode = 400;
      throw parseError;
    }

    this.query = this.query.find(filterObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.select) {
      const fields = this.queryString.select.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }

  paginate() {
    this.page = parseInt(this.queryString.page, 10) || 1;
    this.limit = parseInt(this.queryString.limit, 10) || 25;
    const skip = (this.page - 1) * this.limit;

    this.query = this.query.skip(skip).limit(this.limit);
    return this;
  }

  getPaginationMetadata(totalDocs) {
    const totalPages = Math.ceil(totalDocs / this.limit);
    const startIndex = (this.page - 1) * this.limit;
    const endIndex = this.page * this.limit;
    const pagination = {};

    if (endIndex < totalDocs)
      pagination.next = { page: this.page + 1, limit: this.limit };
    if (startIndex > 0)
      pagination.prev = { page: this.page - 1, limit: this.limit };

    return [totalPages, { ...pagination }];
  }
}
module.exports = APIFeatures;
