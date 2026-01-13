// User model for MongoDB
class User {
  constructor(db) {
    this.collection = db.collection("users");
  }

  async createUser(email, hashedPassword) {
    const user = {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date(),
    };
    const result = await this.collection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async findByEmail(email) {
    return await this.collection.findOne({ email: email.toLowerCase().trim() });
  }

  async findById(userId) {
    return await this.collection.findOne({ _id: userId });
  }
}

module.exports = User;
