const dotenv = {
  STACK_NAME: process.env.STACK_NAME || '',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
};

export default dotenv;
