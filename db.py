import sqlite3

# Step 1: Connect to a database file (it will be created if it doesn't exist)
db_name = "recipe_history.db"  # Name of your database file
connection = sqlite3.connect(db_name)

# Step 2: Create a cursor object to execute SQL commands
cursor = connection.cursor()

# Step 3: SQL statement to create the history table
create_table_query = """
CREATE TABLE IF NOT EXISTS history (
    recipe_id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_name TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
"""

# Step 4: Execute the SQL query
cursor.execute(create_table_query)

# Step 5: Commit the changes and close the connection
connection.commit()
connection.close()

print(f"Database '{db_name}' with table 'history' created successfully!")
