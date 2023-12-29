import SQLite from 'react-native-sqlite-storage';

// Open SQLite database
const db = SQLite.openDatabase({ name: 'game.db', createFromLocation: '~game.db' });

// Create a table for storing marks
db.transaction((tx) => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS marks (id INTEGER PRIMARY KEY AUTOINCREMENT, level INTEGER, score INTEGER)',
    [],
    () => console.log('Table created successfully'),
    (error) => console.error('Error creating table: ', error)
  );
});

const saveScoreToDatabase = (level, score) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO marks (level, score) VALUES (?, ?)',
      [level, score],
      () => console.log('Score saved to database'),
      (error) => console.error('Error saving score to database: ', error)
    );
  });
};
