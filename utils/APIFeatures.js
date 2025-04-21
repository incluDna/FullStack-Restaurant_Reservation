class APIFeatures {
  /**
   * @param {Query}   query        A Mongoose query (e.g. Model.find())
   * @param {Object}  queryString  The raw req.query
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = { ...queryString }; // for select/sort/page/limit
    // make a second object purely for filtering
    this.filterParams = { ...queryString };
    ["select", "sort", "page", "limit"].forEach(
      (f) => delete this.filterParams[f]
    );
  }

  filter() {
    // convert { price: { lte: '100' } } → { price: { $lte: 100 } }
    const str = JSON.stringify(this.filterParams).replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (m) => `$${m}`
    );
    this.query = this.query.find(JSON.parse(str));
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
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 25;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
