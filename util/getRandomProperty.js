function getRandomProperty(obj) {
	// Get an array of the object's keys
	const keys = Object.keys(obj);

	// Check if the object is empty
	if (keys.length === 0) {
		return undefined; // Return undefined if the object is empty
	}

	// Generate a random index
	const randomIndex = Math.floor(Math.random() * keys.length);

	// Use the random index to get a random key
	const randomKey = keys[randomIndex];

	// Return the random key and its corresponding value
	return { key: randomKey, value: obj[randomKey] };
}

export default getRandomProperty;
