const fs = require('fs').promises;
const path = require('path');

class Repository {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async read() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File does not exist, return an empty array
        return [];
      } else {
        throw error;
      }
    }
  }

  async write(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async writeNewData(newData) {
    const data = await this.read();
    data.push(newData);
    await this.write(data);
  }
}

module.exports = { Repository };
