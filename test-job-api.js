// Quick test to see what the API returns
const testJobAPI = async () => {
  try {
    console.log("Testing job API endpoints...");

    // Test all jobs
    const allJobsRes = await fetch("http://localhost:8080/api/job-mgmt/jobs");
    const allJobs = await allJobsRes.json();
    console.log("All jobs:", JSON.stringify(allJobs, null, 2));

    // Test technician jobs for tech001
    const techJobsRes = await fetch(
      "http://localhost:8080/api/job-mgmt/jobs/technician/tech001",
    );
    const techJobs = await techJobsRes.json();
    console.log("Tech001 jobs:", JSON.stringify(techJobs, null, 2));

    // Test job stats for tech001
    const statsRes = await fetch(
      "http://localhost:8080/api/job-mgmt/jobs/stats/tech001",
    );
    const stats = await statsRes.json();
    console.log("Tech001 stats:", JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
};

// For Node.js environment
if (typeof fetch === "undefined") {
  global.fetch = require("node-fetch");
}

testJobAPI();
