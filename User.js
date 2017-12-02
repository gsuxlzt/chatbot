const User = function (id) {
	this.id = id
}

User.prototype.create = function () 

function createUser(id) {
	let user = {}
	let rand_year = Math.floor(Math.random()*13) + 1;
	let rand_work = Math.floor(Math.random()*5);
	let rand_educ = Math.floor(Math.random()*3);
	let bool = Math.floor(Math.random()*2) === 0;
	user.user_profile_creation_date = moment().subtract(rand_year,'years');
	user.user_profile_id = id;
	let user_background = {};
	user_background.work = getWorkStatus(rand_work);
	user_background.education = getEducation(rand_educ);
	user_background.age = bool ? 24 : 26;
	user_background.family = bool
	user.user_background = user_background
	}

	console.log('user created');
}

function getWorkStatus (num) {
	switch (num) {
		case 0:
			return 'UNEMPLOYED'
		case 1:
			return 'OTHER_MICRO_VENDOR'
		case 2:
			return 'SARI_SARI_VENDOR'
		case 3:
			return 'MARKET_VENDOR'
		case 4:
			return 'EMPLOYEE'
	}
}

function getEducation (num) {
	switch (num) {
		case 0:
			return 'NONE'
		case 1:
			return 'HIGH_SCHOOL'
		case 2:
			return 'COLLEGE'
	}
}