// src/utils/request.js
const BASE_URL = 'https://API 서버 기본 주소 넣기';

export const request = async (url, options) => {
  try {
    const response = await fetch(`${BASE_URL}/${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.log(err);
  }
};
