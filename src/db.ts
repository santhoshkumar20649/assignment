import { createConnection } from 'typeorm';
import { User } from './models/user.entity';
import { Feed } from './models/feed.entity';
import { FeedAccess } from './models/feedAccess.entity';
export const connectDatabase = async () => {
    try {
      const connection = await createConnection({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'Softsuave#123',
        database: 'test_database',
        entities: [User,Feed,FeedAccess],
        synchronize: true,
      });
      console.log('Connected to the database');
      return connection;
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  };