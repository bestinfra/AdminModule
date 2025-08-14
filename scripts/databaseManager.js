const { Client } = require('pg');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DatabaseManager {
  constructor() {
    this.dbConfig = {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'root123',
      templateDb: 'subapp_db'
    };
  }

  // Create database for sub-app
  async createSubAppDatabase(appName) {
    const dbName = `${appName}_db`;
    
    try {
      console.log(`🗄️  Creating database: ${dbName}`);
      
      const client = new Client({
        host: this.dbConfig.host,
        port: this.dbConfig.port,
        user: this.dbConfig.user,
        password: this.dbConfig.password,
        database: 'postgres'
      });
      
      await client.connect();
      
      const dbExistsResult = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [dbName]
      );
      
      if (dbExistsResult.rows.length > 0) {
        console.log(`⚠️  Database ${dbName} already exists, skipping creation`);
        await client.end();
        return dbName;
      }
      
      const templateExistsResult = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [this.dbConfig.templateDb]
      );
      
      if (templateExistsResult.rows.length === 0) {
        console.log(`⚠️  Template database ${this.dbConfig.templateDb} not found, creating empty database`);
        await client.query(`CREATE DATABASE "${dbName}"`);
      } else {
        console.log(`📋 Copying structure from template database: ${this.dbConfig.templateDb}`);
        
        await client.query(`CREATE DATABASE "${dbName}" TEMPLATE "${this.dbConfig.templateDb}"`);
        
        await client.end();
        
        const newDbClient = new Client({
          host: this.dbConfig.host,
          port: this.dbConfig.port,
          user: this.dbConfig.user,
          password: this.dbConfig.password,
          database: dbName
        });
        
        await newDbClient.connect();
        
        const tablesResult = await newDbClient.query(`
          SELECT tablename 
          FROM pg_tables 
          WHERE schemaname = 'public' 
          AND tablename NOT LIKE 'pg_%' 
          AND tablename NOT LIKE 'sql_%'
        `);
        
        for (const table of tablesResult.rows) {
          try {
            await newDbClient.query(`TRUNCATE TABLE "${table.tablename}" RESTART IDENTITY CASCADE`);
            console.log(`   ✅ Cleared data from table: ${table.tablename}`);
          } catch (error) {
            console.log(`   ⚠️  Could not clear table ${table.tablename}: ${error.message}`);
          }
        }
        
        await newDbClient.end();
      }
      
      console.log(`✅ Database ${dbName} created successfully`);
      return dbName;
      
    } catch (error) {
      console.error(`❌ Failed to create database ${dbName}:`, error.message);
      
      try {
        console.log(`🔄 Trying fallback method using psql...`);
        const createDbCommand = `psql -h ${this.dbConfig.host} -p ${this.dbConfig.port} -U ${this.dbConfig.user} -d postgres -c "CREATE DATABASE \\"${dbName}\\";"`;
        
        const env = { ...process.env, PGPASSWORD: this.dbConfig.password };
        
        execSync(createDbCommand, { 
          env,
          stdio: 'pipe',
          encoding: 'utf8'
        });
        
        console.log(`✅ Database ${dbName} created using fallback method`);
        return dbName;
        
      } catch (psqlError) {
        console.error(`❌ Fallback method also failed:`, psqlError.message);
        throw new Error(`Could not create database ${dbName}. Please ensure PostgreSQL is running and accessible.`);
      }
    }
  }

  // List all sub-app databases
  async listSubAppDatabases() {
    try {
      const client = new Client({
        host: this.dbConfig.host,
        port: this.dbConfig.port,
        user: this.dbConfig.user,
        password: this.dbConfig.password,
        database: 'postgres'
      });
      
      await client.connect();
      
      const result = await client.query(`
        SELECT datname, pg_size_pretty(pg_database_size(datname)) as size
        FROM pg_database 
        WHERE datname LIKE '%_db' 
        AND datname != 'postgres'
        ORDER BY datname
      `);
      
      await client.end();
      
      console.log('\n📋 Sub-App Databases:');
      console.log('=====================');
      
      if (result.rows.length === 0) {
        console.log('No sub-app databases found.');
        return;
      }
      
      result.rows.forEach(row => {
        console.log(`\n🗄️  ${row.datname}:`);
        console.log(`   • Size: ${row.size}`);
      });
      
    } catch (error) {
      console.error('❌ Failed to list databases:', error.message);
    }
  }

  // Drop a sub-app database
  async dropSubAppDatabase(appName) {
    const dbName = `${appName}_db`;
    
    try {
      console.log(`🗑️  Dropping database: ${dbName}`);
      
      const client = new Client({
        host: this.dbConfig.host,
        port: this.dbConfig.port,
        user: this.dbConfig.user,
        password: this.dbConfig.password,
        database: 'postgres'
      });
      
      await client.connect();
      
      const dbExistsResult = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [dbName]
      );
      
      if (dbExistsResult.rows.length === 0) {
        console.log(`⚠️  Database ${dbName} does not exist`);
        await client.end();
        return false;
      }
      
      await client.query(`DROP DATABASE "${dbName}"`);
      await client.end();
      
      console.log(`✅ Database ${dbName} dropped successfully`);
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to drop database ${dbName}:`, error.message);
      return false;
    }
  }
}

// Export the class
module.exports = DatabaseManager;

// CLI interface
if (require.main === module) {
  const dbManager = new DatabaseManager();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Database Manager CLI');
    console.log('====================');
    console.log('Usage:');
    console.log('  node databaseManager.js create <app-name>');
    console.log('  node databaseManager.js list');
    console.log('  node databaseManager.js drop <app-name>');
    process.exit(1);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'create':
      if (args.length < 2) {
        console.error('Usage: node databaseManager.js create <app-name>');
        process.exit(1);
      }
      (async () => {
        try {
          const dbName = await dbManager.createSubAppDatabase(args[1]);
          console.log(`✅ Database ${dbName} created successfully`);
          process.exit(0);
        } catch (error) {
          console.error('Database creation failed:', error.message);
          process.exit(1);
        }
      })();
      break;
      
    case 'list':
      (async () => {
        try {
          await dbManager.listSubAppDatabases();
          process.exit(0);
        } catch (error) {
          console.error('Failed to list databases:', error.message);
          process.exit(1);
        }
      })();
      break;
      
    case 'drop':
      if (args.length < 2) {
        console.error('Usage: node databaseManager.js drop <app-name>');
        process.exit(1);
      }
      (async () => {
        try {
          const success = await dbManager.dropSubAppDatabase(args[1]);
          process.exit(success ? 0 : 1);
        } catch (error) {
          console.error('Database drop failed:', error.message);
          process.exit(1);
        }
      })();
      break;
      
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
} 