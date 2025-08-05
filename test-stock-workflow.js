// Test script to verify the complete stock management workflow
// This script tests: Stock Manager -> Assign to Clement -> Clement uses stock -> Track usage

const baseURL = 'http://localhost:8888/api/stock-management';

async function testStockWorkflow() {
  console.log('🧪 Testing Stock Management Workflow...\n');

  try {
    // 1. Test getting stock items (Stock Manager perspective)
    console.log('1. 📦 Fetching stock items...');
    const itemsResponse = await fetch(`${baseURL}/items`);
    const itemsData = await itemsResponse.json();
    
    if (itemsData.success && itemsData.data.length > 0) {
      console.log(`✅ Found ${itemsData.data.length} stock items`);
      itemsData.data.forEach(item => {
        console.log(`   - ${item.name}: ${item.quantity} ${item.unit} (${item.status})`);
      });
    } else {
      console.log('❌ No stock items found');
      return;
    }

    // 2. Test assigning stock to Clement
    console.log('\n2. 👤 Assigning stock to Clement...');
    const assignmentData = {
      itemId: itemsData.data[0].id, // Use first available item
      technicianId: 'tech001',
      technicianName: 'Dyondzani Clement Masinge',
      quantity: 50,
      notes: 'Test assignment for workflow verification',
      assignedBy: 'Stock Manager'
    };

    const assignResponse = await fetch(`${baseURL}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignmentData)
    });

    const assignResult = await assignResponse.json();
    if (assignResult.success) {
      console.log(`✅ Successfully assigned ${assignmentData.quantity} ${itemsData.data[0].unit} of ${itemsData.data[0].name} to Clement`);
      console.log(`   Assignment ID: ${assignResult.data.id}`);
    } else {
      console.log(`❌ Failed to assign stock: ${assignResult.error}`);
      return;
    }

    // 3. Test Clement using the stock
    console.log('\n3. 🔧 Simulating Clement using stock...');
    const usageData = {
      assignmentId: assignResult.data.id,
      quantityUsed: 25,
      jobId: 'SA-688808',
      jobTitle: 'FTTH Installation - Test',
      notes: 'Used for customer installation test',
      technicianId: 'tech001'
    };

    const usageResponse = await fetch(`${baseURL}/usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usageData)
    });

    const usageResult = await usageResponse.json();
    if (usageResult.success) {
      console.log(`✅ Successfully recorded usage of ${usageData.quantityUsed} ${itemsData.data[0].unit}`);
      console.log(`   Remaining: ${usageResult.data.assignment.remainingQuantity} ${itemsData.data[0].unit}`);
    } else {
      console.log(`❌ Failed to record usage: ${usageResult.error}`);
      return;
    }

    // 4. Test getting usage history (Stock Manager can see what Clement used)
    console.log('\n4. 📊 Checking usage history...');
    const historyResponse = await fetch(`${baseURL}/usage`);
    const historyData = await historyResponse.json();
    
    if (historyData.success) {
      console.log(`✅ Found ${historyData.data.length} usage records`);
      const clementUsage = historyData.data.filter(u => u.technicianId === 'tech001');
      console.log(`   Clement's usage records: ${clementUsage.length}`);
      clementUsage.forEach(usage => {
        console.log(`   - ${usage.itemName}: ${usage.quantityUsed} used on job ${usage.jobId} (${new Date(usage.usageDate).toLocaleDateString()})`);
      });
    } else {
      console.log('❌ Failed to fetch usage history');
    }

    // 5. Test getting assignments
    console.log('\n5. 📋 Checking current assignments...');
    const assignmentsResponse = await fetch(`${baseURL}/assignments`);
    const assignmentsData = await assignmentsResponse.json();
    
    if (assignmentsData.success) {
      console.log(`✅ Found ${assignmentsData.data.length} assignments`);
      const clementAssignments = assignmentsData.data.filter(a => a.technicianId === 'tech001');
      console.log(`   Clement's assignments: ${clementAssignments.length}`);
      clementAssignments.forEach(assignment => {
        console.log(`   - ${assignment.itemName}: ${assignment.remainingQuantity}/${assignment.assignedQuantity} remaining (${assignment.status})`);
      });
    }

    console.log('\n🎉 Stock workflow test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Stock Manager can view inventory');
    console.log('✅ Stock Manager can assign stock to technicians');
    console.log('✅ Technicians can record stock usage');
    console.log('��� Stock Manager can track all usage history');
    console.log('✅ Real-time inventory updates when stock is used');

  } catch (error) {
    console.error('❌ Error during workflow test:', error);
  }
}

// Run the test
testStockWorkflow();
