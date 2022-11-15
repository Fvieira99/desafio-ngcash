import { faker } from "@faker-js/faker";
import { inputUserData } from "../../src/repositories/userRepository.js";

export function createUserData(
	pwLength = 6,
	shouldBeCorrectPattern = true
): inputUserData {
	let pwPrefix = "aa";

	if (shouldBeCorrectPattern) {
		pwPrefix = "A1";
	}
	return {
		username: faker.internet.userName(),
		password: pwPrefix + faker.internet.password(pwLength, true),
	};
}
