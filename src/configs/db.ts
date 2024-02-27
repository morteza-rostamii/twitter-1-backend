import mongoose from "mongoose";
import { MONGO_URL } from "./config";

// this is singleton class =: only one object will be created

class Database {
  static instance: Database;
  
  constructor() {
    
    if (!Database.instance) {
      
      this.connect();
      Database.instance = this;
    }
    return Database.instance;
  }

  connect():void {
    mongoose.connect(MONGO_URL, {
      maxPoolSize: 1,
    });

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB Atlas');
    });
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB Atlas');
    });
  }
}

export default new Database();