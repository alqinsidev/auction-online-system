import * as bcyrpt from 'bcrypt';

const hashString = async (input: string) => {
  const salt = await bcyrpt.genSalt(10);
  return bcyrpt.hash(input, salt);
};

const compareHash = async (rawString: string, hasedString: string) => {
  return bcyrpt.compare(rawString, hasedString);
};

export { hashString, compareHash };
