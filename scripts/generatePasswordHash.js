const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

async function updatePasswords() {
  try {
    // Generate hash for 'password123'
    const password = 'password123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('Generated password hash for "password123":', hashedPassword);
    
    // Read the current database file
    const dbPath = path.join(__dirname, '../public/data/sage-300-database.json');
    const dbContent = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(dbContent);
    
    // Update all employee passwords
    data.employees.forEach(employee => {
      employee.Password = hashedPassword;
    });
    
    // Write back to file
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    
    console.log('Updated all employee passwords in database');
    console.log('Test credentials:');
    console.log('- Email: any employee email (e.g., thembi@company.com, clement@company.com)');
    console.log('- Password: password123');
    
  } catch (error) {
    console.error('Error updating passwords:', error);
  }
}

updatePasswords();
