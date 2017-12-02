class EmploymentType {
    constructor (name, score) {
        this.name = name;
        this.score = score;
    }
}

const EMPLOYEE = new EmploymentType('EMPLOYEE', 20);
const MARKET_VENDOR = new EmploymentType('MARKET_VENDOR', 20);
const SARI_SARI_VENDOR = new EmploymentType('SARI_SARI_VENDOR', 10);
const OTHER_MICRO_VENDOR = new EmploymentType('OTHER_MICRO_VENDOR', 10);
const UNEMPLOYED = new EmploymentType('UNEMPLOYED', 0);

module.exports = {
    CLASS: EmploymentType,
    EMPLOYEE,
    MARKET_VENDOR,
    SARI_SARI_VENDOR,
    OTHER_MICRO_VENDOR,
    UNEMPLOYED
};
