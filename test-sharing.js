// Test script to verify multi-user job sharing functionality
// You can run this in the browser console when on the jobs page

console.log('🧪 Testing Multi-User Job Sharing');

// Wait for the page to fully load and the global function to be available
setTimeout(() => {
  // Mock data for testing
  const testJob = {
    id: "test-job",
    title: "Test Frontend Developer",
    company: "Test Corp",
    location: "Remote",
    type: "full-time",
    salary: "$100k - $120k",
    description: "Test job description",
    requirements: ["React", "TypeScript"],
    postedDate: new Date(),
    isNew: true
  };

  console.log('🔍 Checking if shareJobToChat is available:', typeof window.shareJobToChat);

  if (window.shareJobToChat) {
    // Test 1: Single user sharing
    console.log('\n🔬 Test 1: Single User Sharing to Sarah');
    window.shareJobToChat('sarah-johnson', 'Check this out!', testJob);
    console.log('✅ Single user share completed');

    // Test 2: Multiple users sharing (existing conversations)
    console.log('\n🔬 Test 2: Multiple Users Sharing (Existing Conversations)');
    const existingUserIds = ['sarah-johnson', 'mike-chen', 'emily-davis'];
    window.shareJobToChat(existingUserIds, 'Great opportunity for all of you!', testJob);
    console.log('✅ Multi-user share to existing conversations completed');

    // Test 3: New conversation creation
    console.log('\n🔬 Test 3: New Conversation Creation');
    const newUserIds = ['alex-rodriguez', 'lisa-wang'];
    window.shareJobToChat(newUserIds, 'Hello new contacts!', testJob);
    console.log('✅ New conversation creation test completed');

    // Test 4: Mixed - existing and new users
    console.log('\n🔬 Test 4: Mixed Users (Existing + New)');
    const mixedUserIds = ['sarah-johnson', 'alex-rodriguez', 'lisa-wang'];
    window.shareJobToChat(mixedUserIds, 'Mixed conversation test!', testJob);
    console.log('✅ Mixed users test completed');

    console.log('\n🎯 All tests completed! Go to Messages page to see the results.');
    console.log('\n💡 Available users for testing:');
    console.log('   - sarah-johnson (existing conversation)');
    console.log('   - mike-chen (existing conversation)'); 
    console.log('   - emily-davis (existing conversation)');
    console.log('   - alex-rodriguez (new conversation)');
    console.log('   - lisa-wang (new conversation)');
    
    console.log('\n🚀 Navigate to /messages to see all the shared jobs!');
  } else {
    console.log('❌ shareJobToChat function not available. Make sure you are on a job page.');
    console.log('📍 Try refreshing the page or navigating to /jobs first.');
  }
}, 1000); // Wait 1 second for everything to load
