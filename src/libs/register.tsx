// ฟังก์ชันสำหรับลงทะเบียนผู้ใช้ใหม่
const registerUser = async (userData) => {
    const response = await fetch('http://your-backend-url/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  
    const data = await response.json();
    return data;
  };
  