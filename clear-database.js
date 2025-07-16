const { execSync } = require('child_process');

// Drop all tables to allow TypeORM to recreate them with new schema
const commands = [
  'psql -U postgres -d manali_database -c "DROP TABLE IF EXISTS package_bookings CASCADE;"',
  'psql -U postgres -d manali_database -c "DROP TABLE IF EXISTS package_schedules CASCADE;"',
  'psql -U postgres -d manali_database -c "DROP TABLE IF EXISTS hotel_schedules CASCADE;"',
  'psql -U postgres -d manali_database -c "DROP TABLE IF EXISTS packages CASCADE;"',
  'psql -U postgres -d manali_database -c "DROP TABLE IF EXISTS hotels CASCADE;"',
  'psql -U postgres -d manali_database -c "DROP TABLE IF EXISTS users CASCADE;"',
];

commands.forEach(command => {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    console.log('Success!');
  } catch (error) {
    console.error('Error:', error.message);
  }
});