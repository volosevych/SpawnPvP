document.addEventListener("DOMContentLoaded", function () {
  let leaderboardData = [
    { name: "Player1", score: 8 },
    { name: "Player2", score: 6 },
    { name: "Player3", score: 5 },
    { name: "Player4", score: 3 },
    { name: "Player5", score: 3 },
  ];

  const searchInput = document.getElementById("searchInput");
  const leaderboardBody = document.getElementById("leaderboard-body");

  if (!searchInput || !leaderboardBody) {
    console.error("❌ searchInput or leaderboardBody not found!");
    return;
  }

  console.log("✅ Elements found:", { searchInput, leaderboardBody });

  function updateLeaderboard(searchQuery = "") {
    leaderboardBody.innerHTML = "";

    const filteredData = leaderboardData
      .filter((player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.score - a.score);

    if (filteredData.length === 0) {
      leaderboardBody.innerHTML = `
          <tr>
            <td colspan="3" class="text-muted">No players found</td>
          </tr>
        `;
      console.warn("⚠️ No players found matching:", searchQuery);
      return;
    }

    filteredData.forEach((player, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${index + 1}</td>
          <td>${player.name}</td>
          <td>${player.score}</td>
        `;
      leaderboardBody.appendChild(row);
    });
  }

  updateLeaderboard();

  searchInput.addEventListener("input", function () {
    updateLeaderboard(searchInput.value);
  });
});
