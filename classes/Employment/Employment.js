const EmploymentTypes = require('./EmploymentTypes');

const EmploymentType = EmploymentTypes.CLASS;

class Employment {
    constructor(employmentType) {
        if (!employmentType instanceof EmploymentType) {
            throw new Error('Invalid Employment Type!');
        }

        this.employmentType = employmentType;
    }

    getType() {
        return this.employmentType.name;
    }

    getScore() {
        return this.employmentType.score;
    }
}

exports.default = Employment;
