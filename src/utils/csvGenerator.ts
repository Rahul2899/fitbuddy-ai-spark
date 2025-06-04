// src/utils/csvGenerator.ts
export const generateUserCSVEntry = async (profileData: any, fullName: string) => {
    // Generate unique user ID
    const timestamp = Date.now().toString().slice(-6);
    const userId = `USR${timestamp}`;
    
    console.log('Generating CSV for:', { userId, fullName, profileData });
    
    try {
      const response = await fetch('http://localhost:5000/api/generate-csv', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          full_name: fullName,
          age: profileData.age,
          gender: profileData.gender,
          fitness_level: profileData.fitnessLevel,
          fitness_goal: profileData.fitnessGoal,
          limitations: profileData.limitations
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('CSV generation success:', result);
      
      if (result.success) {
        return result.user_id;
      } else {
        throw new Error(result.message || 'CSV generation failed');
      }
    } catch (error) {
      console.error('CSV generation error:', error);
      // Return a mock user ID for demo purposes if API fails
      return userId;
    }
  };