class ApiFeatures {
    constructor(query, queryStr) { // Here query = product.find() & queryStr = req.query
        this.query = query;
        this.queryStr = queryStr;
    }
    // Search Method
    search() {
        // Use Ternary Operator to Assign Value to search keyword
        const keyword = this.queryStr.keyword ?
            {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: 'i'
                }
            } : {}
        // Use MongoDB find Method to search for Product
        this.query = this.query.find({ ...keyword });
        return this
    }
    // Filter Method
    filter() {
        // All the Objects in the javascript are passed by reference. So to create a Copy of this.queryStr we use REST Operator
        const queryStrCopy = { ...this.queryStr };
        // Remove Fields - This is typically used to remove pagination-related and search-related parameters from the query object.
        const removeFields = ['keyword', 'page', 'limit'];
        removeFields.forEach((removeField) => {
            delete queryStrCopy[removeField]
        })
        // Convert object to a Json String
        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (removeField) => `$${removeField}`); // b looks for the word boundaries like price Range etc.
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    // Pagination Method - How many Products Should be Shown at a Single Page
    pagination(resultsPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultsPerPage * (currentPage - 1); // Number of Products to be Skipped Per Page
        this.query = this.query.limit(resultsPerPage).skip(skip);
        return this;
    }
};

module.exports = ApiFeatures