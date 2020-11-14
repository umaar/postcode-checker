function createFetchMock(jsonResponse) {
	return async function () {
		return {
			async json() {
				return jsonResponse;
			}
		};
	};
}

export default createFetchMock;
