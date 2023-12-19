async function test(collection) {
  return await collection.find();
}

module.exports = test;
