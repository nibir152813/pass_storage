const { ObjectId } = require("mongodb");

class User {
  constructor(db) {
    this.collection = db.collection("users");
  }

  async createUser(email, hashedPassword) {
    const user = {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isPremium: false,
      premiumSince: null,
      createdAt: new Date(),
    };
    const result = await this.collection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async findByEmail(email) {
    return await this.collection.findOne({ email: email.toLowerCase().trim() });
  }

  async findById(userId) {
    return await this.collection.findOne({ _id: new ObjectId(userId) });
  }

  async upgradeToPremium(userId) {
    const _id = new ObjectId(userId);
    await this.collection.updateOne(
      { _id },
      {
        $set: {
          isPremium: true,
          premiumSince: new Date(),
        },
      }
    );
    return await this.collection.findOne({ _id });
  }
}

module.exports = User;
