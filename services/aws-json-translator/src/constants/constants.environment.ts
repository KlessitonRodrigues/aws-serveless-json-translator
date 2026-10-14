import '../config/config.dotenv'; // sort-imports-ignore

const dotenv = {
  STACK_NAME: process.env.STACK_NAME || '',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  TEST_API_URL: process.env.TEST_API_URL || 'http://localhost:3005',
};

export default dotenv;
