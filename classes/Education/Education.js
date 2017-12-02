const EducationTypes = require('./EducationTypes');

const EducationType = EducationTypes.CLASS;

class Education {
    constructor(educationType) {
        if (!educationType instanceof EducationType) {
            throw new Error('Invalid Education Type!');
        }

        this.educationType = educationType;
    }

    getType() {
        return this.educationType.name;
    }

    getScore() {
        return this.educationType.score;
    }
}

exports.default = Education;
