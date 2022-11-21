export function createTransactionData(
	creditedAccountOwnerUsername = "user",
	value = 5000
) {
	return {
		creditedAccountOwnerUsername,
		value,
	};
}
