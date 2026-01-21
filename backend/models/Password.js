class Password {
  constructor(db) {
    this.collection = db.collection("passwords");
  }

  async createPassword(userId, site, username, password) {
    const passwordEntry = {
      userId: userId,
      site: site,
      username: username,
      password: password,
      createdAt: new Date(),
    };
    const result = await this.collection.insertOne(passwordEntry);
    return { ...passwordEntry, _id: result.insertedId };
  }

  async getPasswordsByUserId(userId) {
    return await this.collection.find({ userId: userId }).toArray();
  }

  async getPasswordById(passwordId, userId) {
    return await this.collection.findOne({
      _id: passwordId,
      userId: userId,
    });
  }

  async updatePassword(passwordId, userId, site, username, password) {
    const result = await this.collection.updateOne(
      { _id: passwordId, userId: userId },
      {
        $set: {
          site: site,
          username: username,
          password: password,
          updatedAt: new Date(),
        },
      }
    );
    return result;
  }

  async deletePassword(passwordId, userId) {
    const result = await this.collection.deleteOne({
      _id: passwordId,
      userId: userId,
    });
    return result;
  }

  async countPasswordsByUserId(userId) {
    return await this.collection.countDocuments({ userId: userId });
  }
}

module.exports = Password;
