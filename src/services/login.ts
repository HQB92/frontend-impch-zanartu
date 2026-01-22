import axios from 'axios';

export const login = async (username: string, password: string): Promise<string | null> => {
  const data = JSON.stringify({
    username,
    password,
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_PATHLOGIN}`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data.token;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
