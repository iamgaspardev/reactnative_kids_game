import SQLite from 'react-native-sqlite-storage';

class Service {
  constructor() {
    this.db = null;
    SQLite.DEBUG(true);
    SQLite.enablePromise(true);

    this.initializationPromise = new Promise((resolve, reject) => {
      SQLite.openDatabase({ name: 'game.db', createFromLocation: 2 }, (db) => {
        this.db = db;
        console.log('Database opened successfully');
        this.createTable();
        resolve();
      }, (error) => {
        console.error('Error opening database:', error);
        reject(error);
      });
    });
  }

  async initializeDatabase() {
    await this.initializationPromise;
  }
  createTable = () => {
    this.db.transaction(
      (tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS high_scores (id INTEGER PRIMARY KEY AUTOINCREMENT, level INTEGER, score INTEGER)',
          [],
          () => {
            console.log('Table created successfully');
          },
          (_, error) => {
            console.error('Error creating table:', error);
          }
        );
      },
      this.transactionError
    );
  };

  transactionError = (error) => {
    console.error('Transaction error:', error);
  };

  saveHighScore = (level, score) => {
    console.log("scores ---------------------->", level, score);
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'INSERT INTO high_scores (level, score) VALUES (?, ?)',
            [level, score],
            (_, results) => {
              const { insertId } = results;
              console.log(`Inserted high score with ID ${insertId}`);
              resolve(insertId);
            },
            (_, error) => {
              this.handleDatabaseError('Error inserting high score:', error, reject);
            }
          );
        },
        this.transactionError
      );
    });
  };
  getHighestScore = async (level) => {
    await this.initializeDatabase();
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT MAX(score) AS highestScore FROM high_scores WHERE level = ?',
            [level],
            (_, results) => {
              const { rows } = results;
              const highestScore = rows.item(0).highestScore || 0;
              resolve(highestScore);
            },
            (_, error) => {
              this.handleDatabaseError('Error getting highest score:', error, reject);
            }
          );
        },
        this.transactionError
      );
    });
  };

  getLastHighestScore = async () => {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT MAX(score) AS lastHighestScore FROM high_scores',
            [],
            (_, results) => {
              const { rows } = results;
              const lastHighestScore = rows.item(0).lastHighestScore || 0;
              resolve(lastHighestScore);
            },
            (_, error) => {
              this.handleDatabaseError('Error getting last highest score:', error, reject);
            }
          );
        },
        this.transactionError
      );
    });
  };
   
  
  canPlayLevel = async (currentLevel) => {
    if (currentLevel === 1) {
      return true;
    }

    try {
      const highestScore = await this.getHighestScore(currentLevel - 1);
      return highestScore >= 100;
    } catch (error) {
      console.error('Error checking if level can be played:', error);
      return false;
    }
  };
  

  handleDatabaseError = (message, error, reject) => {
    if (typeof error === 'function') {
      console.error(message, error());
      reject(error());
    } else {
      console.error(message, error || 'Unknown error');
      reject(error || 'Unknown error');
    }
  };
  static initialize() {
    SQLite.DEBUG(true);
    SQLite.enablePromise(true);

    return new Service();
  }
}

export default new Service();
