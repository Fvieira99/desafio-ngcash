export function createTransactionData(
	creditedAccountOwnerId = 2,
	value = 5000
) {
	return {
		creditedAccountOwnerId,
		value,
	};
}
