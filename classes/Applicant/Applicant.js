const moment = require('moment');

const Employment = require('../Employment/Employment').default;
const Education = require('../Education/Education').default;

const EmploymentTypes = require('../Employment/EmploymentTypes');
const EducationTypes = require('../Education/EducationTypes');

class Applicant {
    constructor(id,
                userProfileCreationDate = null,
                background = {} ) {
        this.id = id;

        const randYear = Math.floor(Math.random()*13) + 1;
        this.userProfileCreationDate = userProfileCreationDate ?
            userProfileCreationDate :
            moment().subtract(randYear,'years');

        this.background = {
            employment: null,
            education: null,
            age: null,
            hasFamily: null
        };
    }

    createRandomBackground() {
        // randomized user background for testing

        const empTypeArray = [
            EmploymentTypes.EMPLOYEE,
            EmploymentTypes.MARKET_VENDOR,
            EmploymentTypes.SARI_SARI_VENDOR,
            EmploymentTypes.OTHER_MICRO_VENDOR,
            EmploymentTypes.UNEMPLOYED
        ];
        const randEmp = Math.floor(Math.random()*5);
        this.setEmployment(empTypeArray[randEmp]);

        const educTypeArray = [
            EducationTypes.HIGH_SCHOOL,
            EducationTypes.COLLEGE,
            EducationTypes.NONE
        ];
        const randEduc = Math.floor(Math.random()*3);
        this.setEducation(educTypeArray[randEduc]);

        const bool = Math.floor(Math.random()*2) === 0;
        this.setAge(bool ? 26 : 24);
        this.setFamily(bool);
    }

    setEmployment(employmentType) {
        this.background.employment = new Employment(employmentType);
    }

    setEducation(educationType) {
        this.background.education = new Education(educationType);
    }

    setAge(age) {
        const isAgeValid = !isNaN(age) || age % 1 === 0 || age > 0;

        if (!isAgeValid) {
            throw new Error('Invalid age!')
        }

        this.background.age = age;
    }

    setFamily(hasFamily) {
        if (typeof hasFamily !== 'boolean') {
            throw new Error('hasFamily must be boolean!');
        }

        this.background.hasFamily = hasFamily;
    }

    getCreditScore() {
        const {
            employment,
            education,
            age,
            hasFamily
        } = this.background; 
        
        let creditScore = employment.getScore() + education.getScore();

        if (age >= 25) {
            creditScore += 20;
        }

        if (hasFamily) {
            creditScore += 20;
        }

        return creditScore;
    }
    
    getMaxLoanableAmount(creditScore) {
        if (creditScore < 60) {
            return 0;
        } else {
            return Math.floor(10000*(2 - (100 - creditScore)/40));
        }
    }
}

exports.default = Applicant;
