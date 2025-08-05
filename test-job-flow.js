// Test script to verify complete job management flow
// Run this in the browser console when on the application

async function testCompleteJobFlow() {
  console.log("🚀 Starting complete job flow test...");

  try {
    // Step 1: Create a new job
    console.log("📝 Step 1: Creating a new job...");
    const createResponse = await fetch("/api/job-mgmt/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Installation Job",
        description: "Test fiber installation for flow verification",
        type: "Installation",
        priority: "High",
        client: {
          name: "Test Customer Ltd",
          address: "123 Test Street, Test City",
          contactPerson: "John Test",
          phone: "+27123456789",
        },
        estimatedHours: 3,
      }),
    });

    if (!createResponse.ok) {
      throw new Error(`Create job failed: ${createResponse.status}`);
    }

    const createResult = await createResponse.json();
    console.log("✅ Job created successfully:", createResult.data);
    const jobId = createResult.data.id;

    // Step 2: Assign job to technician
    console.log("👤 Step 2: Assigning job to technician...");
    const assignResponse = await fetch(`/api/job-mgmt/jobs/${jobId}/assign`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        technicianId: "tech001",
      }),
    });

    if (!assignResponse.ok) {
      throw new Error(`Assign job failed: ${assignResponse.status}`);
    }

    const assignResult = await assignResponse.json();
    console.log("✅ Job assigned successfully:", assignResult.data);

    // Step 3: Technician accepts the job
    console.log("👍 Step 3: Technician accepting job...");
    const acceptResponse = await fetch(`/api/job-mgmt/jobs/${jobId}/accept`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        technicianId: "tech001",
      }),
    });

    if (!acceptResponse.ok) {
      throw new Error(`Accept job failed: ${acceptResponse.status}`);
    }

    const acceptResult = await acceptResponse.json();
    console.log("✅ Job accepted successfully:", acceptResult.data);

    // Step 4: Technician starts the job
    console.log("▶️ Step 4: Technician starting job...");
    const startResponse = await fetch(`/api/job-mgmt/jobs/${jobId}/start`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        technicianId: "tech001",
        location: { lat: -26.2041, lng: 28.0473 },
      }),
    });

    if (!startResponse.ok) {
      throw new Error(`Start job failed: ${startResponse.status}`);
    }

    const startResult = await startResponse.json();
    console.log("✅ Job started successfully:", startResult.data);

    // Step 5: Technician completes the job
    console.log("✅ Step 5: Technician completing job...");
    const completeResponse = await fetch(
      `/api/job-mgmt/jobs/${jobId}/complete`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId: "tech001",
          timeSpent: 2.5,
          notes: "Installation completed successfully. All tests passed.",
          photos: ["photo1.jpg", "photo2.jpg"],
        }),
      },
    );

    if (!completeResponse.ok) {
      throw new Error(`Complete job failed: ${completeResponse.status}`);
    }

    const completeResult = await completeResponse.json();
    console.log("✅ Job completed successfully:", completeResult.data);

    // Step 6: Verify the final job state
    console.log("🔍 Step 6: Verifying final job state...");
    const verifyResponse = await fetch(`/api/job-mgmt/jobs/${jobId}`);

    if (!verifyResponse.ok) {
      throw new Error(`Verify job failed: ${verifyResponse.status}`);
    }

    const verifyResult = await verifyResponse.json();
    console.log("✅ Final job state:", verifyResult.data);

    // Step 7: Get technician stats
    console.log("📊 Step 7: Getting technician statistics...");
    const statsResponse = await fetch(`/api/job-mgmt/jobs/stats/tech001`);

    if (!statsResponse.ok) {
      throw new Error(`Get stats failed: ${statsResponse.status}`);
    }

    const statsResult = await statsResponse.json();
    console.log("✅ Technician stats:", statsResult.data);

    console.log("🎉 COMPLETE JOB FLOW TEST PASSED! 🎉");
    console.log("✨ Summary:");
    console.log(`   - Job ${jobId} was created`);
    console.log(`   - Assigned to tech001`);
    console.log(`   - Accepted by technician`);
    console.log(`   - Started and completed`);
    console.log(`   - Final status: ${verifyResult.data.status}`);
    console.log(
      `   - Technician now has ${statsResult.data.completed} completed jobs`,
    );

    return {
      success: true,
      jobId,
      finalStatus: verifyResult.data.status,
      technicianStats: statsResult.data,
    };
  } catch (error) {
    console.error("❌ Test failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Export for use
if (typeof window !== "undefined") {
  window.testCompleteJobFlow = testCompleteJobFlow;
  console.log(
    "🧪 Test function loaded! Run 'testCompleteJobFlow()' to test the complete job flow.",
  );
} else {
  module.exports = { testCompleteJobFlow };
}
