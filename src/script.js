      let visitStartTime;
      let totalDuration = 0; // Total duration in seconds
      let intervalId;
      let visitorID = generateUniqueID();
      let activeUsers = 0; // To keep track of active users
      const profilePictures = [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/1.jpg",
        "https://randomuser.me/api/portraits/men/2.jpg",
        "https://randomuser.me/api/portraits/women/2.jpg",
        "https://randomuser.me/api/portraits/men/3.jpg",
        "https://randomuser.me/api/portraits/women/3.jpg",
        "https://randomuser.me/api/portraits/men/4.jpg",
        "https://randomuser.me/api/portraits/women/4.jpg",
        "https://randomuser.me/api/portraits/men/5.jpg",
        "https://randomuser.me/api/portraits/women/5.jpg",
      ];
      const visitorProfilePicture =
        profilePictures[Math.floor(Math.random() * profilePictures.length)];

      async function getVisitorData() {
        activeUsers++;
        try {
          const response = await axios.get("https://ipapi.co/json/");
          const { ip, city, region, country, loc } = response.data; // loc is "latitude,longitude"
          const now = new Date();
          visitStartTime = now;

          // Send a welcome message to Discord webhook
          await sendMessageToDiscord(
            ip,
            city,
            region,
            country,
            now,
            "green",
            null,
            loc
          );

          // Start sending tally messages every 5 minutes
          intervalId = setInterval(() => {
            totalDuration += 5 * 60; // Add 5 minutes (300 seconds)
            sendTallyMessage(ip, city, region, country, loc);
          }, 5 * 60 * 1000); // 5 minutes in milliseconds

          // Send the count of active users to Discord
          await sendUserCountToDiscord(activeUsers);
        } catch (error) {
          console.error(
            "Error fetching visitor data or sending webhook:",
            error
          );
        }
      }

      async function sendUserCountToDiscord(count) {
        const embed = {
          content: null,
          embeds: [
            {
              color: 0x00ff00,
              title: "Active Users",
              description: `Currently active users: ${count}`,
              timestamp: new Date().toISOString(),
            },
          ],
        };

        await axios.post(
          "https://discord.com/api/webhooks/1289859961509122079/jftPuqh82s7eMUOFlP8dGOWeqddfjV5paAzH3qc2KlVsU_rq97jBMHeUNcwyrJcSuFKM",
          embed
        );
      }

      async function sendMessageToDiscord(
        ip,
        city,
        region,
        country,
        date,
        color,
        duration,
        loc
      ) {
        const formattedDate = date.toLocaleString("en-US", {
          timeZone: "America/Chicago",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        const period = getPeriod(date);

        const embed = {
          content: null,
          embeds: [
            {
              color: color === "green" ? 0x00ff00 : 0xff0000,
              title: color === "green" ? "New Visitor!" : "Visitor Left!",
              fields: [
                { name: "IP", value: ip || "N/A", inline: true },
                {
                  name: "Location",
                  value: `${city || "N/A"}, ${region || "N/A"}, ${
                    country || "N/A"
                  }`,
                  inline: true,
                },
                { name: "Date Entered", value: formattedDate, inline: true },
                { name: "Period", value: period, inline: true },
                {
                  name: "User Agent",
                  value: navigator.userAgent,
                  inline: false,
                },
                { name: "Unique Visitor ID", value: visitorID, inline: true },
                {
                  name: "Total Duration",
                  value: duration || "N/A",
                  inline: false,
                },
                {
                  name: "Referral URL",
                  value: document.referrer || "Direct",
                  inline: false,
                },
              ],
              image: {
                url: visitorProfilePicture, // Profile picture in the embed
              },
              timestamp: new Date().toISOString(),
            },
          ],
        };

        await axios.post(
          "https://discord.com/api/webhooks/1289859961509122079/jftPuqh82s7eMUOFlP8dGOWeqddfjV5paAzH3qc2KlVsU_rq97jBMHeUNcwyrJcSuFKM",
          embed
        );
      }

      async function sendTallyMessage(ip, city, region, country, loc) {
        const tallyDuration = totalDuration; // Total duration in seconds
        const formattedDuration = formatDuration(tallyDuration); // Format duration to HH:MM:SS
        const now = new Date();
        const [latitude, longitude] = loc.split(",");

        const embed = {
          content: null,
          embeds: [
            {
              color: 0xff0000, // Red color
              title: "Time Tally",
              fields: [
                { name: "IP", value: ip || "N/A", inline: true },
                {
                  name: "Location",
                  value: `${city || "N/A"}, ${region || "N/A"}, ${
                    country || "N/A"
                  }`,
                  inline: true,
                },
                {
                  name: "Total Time",
                  value: `${Math.floor(tallyDuration / 60)} minutes and ${
                    tallyDuration % 60
                  } seconds`,
                  inline: true,
                }, // Total time
                { name: "Duration", value: formattedDuration, inline: false },
                { name: "Unique Visitor ID", value: visitorID, inline: true },
                {
                  name: "Last Active",
                  value: now.toLocaleString("en-US", {
                    timeZone: "America/Chicago",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  }),
                  inline: true,
                },
              ],
              image: {
                url: visitorProfilePicture, // Profile picture in the embed
              },
              timestamp: new Date().toISOString(),
            },
          ],
        };

        await axios.post(
          "https://discord.com/api/webhooks/1289862970825900075/Qwjd6Qj6XYaq3er30EcYxLzg6bSUWL2BhNrR5Xcxi5MyuAkVKIfvGyIyvE9VgdvlmJIR",
          embed
        );
      }

      function formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${String(hours).padStart(2, "0")} hours, ${String(
          remainingMinutes
        ).padStart(2, "0")} minutes, and ${String(secs).padStart(
          2,
          "0"
        )} seconds`; // HH:MM:SS
      }

      function generateUniqueID() {
        return "visitor-" + Math.random().toString(36).substr(2, 9); // Generate a unique ID for each visitor
      }

      function getPeriod(date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const totalMinutes = hours * 60 + minutes;

        if (totalMinutes < 8 * 60 + 40) return "Morning";
        if (totalMinutes < 9 * 60 + 45) return "1st Period";
        if (totalMinutes < 11 * 60 + 20) return "2nd Period";
        if (totalMinutes < 13 * 60 + 35) return "3rd Period";
        if (totalMinutes < 15 * 60 + 5) return "4th Period";
        if (totalMinutes < 16 * 60 + 10) return "5th Period";
        return "Home";
      }

      window.onload = getVisitorData;

      window.onbeforeunload = async () => {
        clearInterval(intervalId); // Stop the interval when leaving
        const visitEndTime = new Date();
        await sendMessageToDiscord(
          "N/A",
          "N/A",
          "N/A",
          "N/A",
          visitEndTime,
          "red",
          formatDuration(totalDuration),
          "N/A"
        );
      };
const overlay = document.getElementById("overlay");
      const correctPassword = "Pizzacake";
      // Force scroll to top on page load
      window.addEventListener("load", function () {
        window.scrollTo(0, 0); // Scroll to the top immediately
      });
      document.addEventListener("DOMContentLoaded", function () {
        const gameList = document.getElementById("game-list");
        const sidebar = document.querySelector(".sidebar");

        // Gather all grid items and extract game information
        const gridItems = document.querySelectorAll(".grid-item");
        const games = [];

        gridItems.forEach((item) => {
          const button = item.querySelector(".grid-btn");
          const pElement = item.querySelector("p");
          if (button && pElement) {
            const gameName = pElement.textContent;
            const onclickAttr = button.getAttribute("onclick");
            const hrefMatch = onclickAttr ? onclickAttr.match(/'(.*?)'/) : null;
            const href = hrefMatch ? hrefMatch[1] : "#"; // Fallback href

            games.push({ name: gameName, href: href });
          } else {
            console.warn("Grid item missing required elements", item);
          }
        });

        // Sort games alphabetically
        games.sort((a, b) => a.name.localeCompare(b.name));

        // Populate the sidebar with sorted games
        games.forEach((game) => {
          const listItem = document.createElement("li");
          const link = document.createElement("a");
          link.href = game.href;
          link.textContent = game.name;
          listItem.appendChild(link);
          gameList.appendChild(listItem);
        });
      });

      // Simplified redirectTo function with cloaking and optional password protection
      function redirectTo(url, cloak = false, passwordRequired = false) {
        if (passwordRequired) {
          overlay.style.display = "flex";
          localStorage.setItem("redirectUrl", url); // Store the URL to redirect to after password check
          localStorage.setItem("cloak", cloak); // Store if it should be cloaked
        } else {
          openUrl(url, cloak);
        }
      }

      function openUrl(url, cloak) {
        if (cloak) {
          var win = window.open("about:blank", "_blank");
          win.document.body.style.margin = "0";
          win.document.body.style.height = "100vh";
          var iframe = win.document.createElement("iframe");
          iframe.style.border = "none";
          iframe.style.width = "100%";
          iframe.style.height = "100%";
          iframe.style.margin = "0";
          iframe.src = url;
          win.document.body.appendChild(iframe);
        } else {
          window.open(url, "_blank");
        }
      }

      function checkPassword() {
        const inputPassword = document.getElementById("password-input").value;
        const redirectUrl = localStorage.getItem("redirectUrl");
        const cloak = JSON.parse(localStorage.getItem("cloak"));

        if (inputPassword === correctPassword) {
          overlay.style.display = "none"; // Hide the overlay
          openUrl(redirectUrl, cloak); // Redirect to the stored URL, with or without cloaking
          localStorage.removeItem("redirectUrl"); // Clear stored URL
          localStorage.removeItem("cloak"); // Clear stored cloaking preference
        } else {
          alert("Incorrect password. Please try again."); // Alert if password is incorrect
        }
      }

      function filterGames() {
        const searchTerm = document
          .getElementById("search-input")
          .value.toLowerCase();
        const gridItems = document.querySelectorAll(".grid-item");
        const gridItemspecial = document.querySelectorAll(
          ".big-buttons-container"
        );

        gridItems.forEach((item) => {
          const gameTitle = item.querySelector("p").textContent.toLowerCase();
          if (gameTitle.includes(searchTerm)) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
        gridItemspecial.forEach((item) => {
          if (searchTerm == null && searchTerm == "") {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      }
