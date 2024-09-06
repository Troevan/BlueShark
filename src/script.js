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
