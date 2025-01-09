// Classes with special counters
const specialClasses = {
    Healer: "Holy Essence",
    Druid: "Seasons",
    Barbarian: "Rage Points",
};

const seasons = ["Spring", "Summer", "Fall", "Winter"];

// Handle class change to update special counter
document.getElementById("class-select").addEventListener("change", (event) => {
    const selectedClass = event.target.value;
    const specialCounterGroup = document.querySelector(".special-counter-group");
    const specialCounterLabel = document.getElementById("special-counter-label");
    const specialCounterInput = document.getElementById("special-counter");
    const seasonCounter = document.getElementById("season-counter");

    if (specialClasses[selectedClass]) {
        // Show the special counter group
        specialCounterGroup.style.display = "flex";

        if (selectedClass === "Druid") {
            // For Druid, display seasons
            specialCounterLabel.textContent = "Seasons";
            specialCounterInput.style.display = "none"; // Hide numeric input
            seasonCounter.style.display = "block"; // Show seasons
            seasonCounter.textContent = localStorage.getItem("season-counter") || "Spring"; // Default or cached season
        } else {
            // For Healer and Barbarian, display numeric counter
            specialCounterLabel.textContent = specialClasses[selectedClass];
            specialCounterInput.style.display = "block"; // Show numeric input
            specialCounterInput.value = localStorage.getItem("special-counter") || 0; // Default or cached value
            seasonCounter.style.display = "none"; // Hide seasons
        }
    } else {
        // Hide the special counter group if the class does not have one
        specialCounterGroup.style.display = "none";
    }
});

// Load cached values from localStorage when the page loads
window.addEventListener("load", () => {
    const cachedClass = localStorage.getItem("class-select");
    const cachedHP = localStorage.getItem("hp");
    const cachedDefense = localStorage.getItem("defense");
    const cachedBlock = localStorage.getItem("block");
    const cachedDamage = localStorage.getItem("damage-received");

    // Restore class selection
    if (cachedClass) {
        document.getElementById("class-select").value = cachedClass;
        document.getElementById("class-select").dispatchEvent(new Event("change")); // Trigger class-specific updates
    }

    // Restore other values
    if (cachedHP) document.getElementById("hp").value = cachedHP;
    if (cachedDefense) document.getElementById("defense").value = cachedDefense;
    if (cachedBlock) document.getElementById("block").value = cachedBlock;
    if (cachedDamage) document.getElementById("damage-received").value = cachedDamage;
});

// Save values to localStorage when inputs are changed
const saveToLocalStorage = () => {
    localStorage.setItem("class-select", document.getElementById("class-select").value);
    localStorage.setItem("hp", document.getElementById("hp").value);
    localStorage.setItem("defense", document.getElementById("defense").value);
    localStorage.setItem("block", document.getElementById("block").value);
    localStorage.setItem("damage-received", document.getElementById("damage-received").value);

    // Save special counter
    const specialCounterInput = document.getElementById("special-counter");
    if (specialCounterInput.style.display === "block") {
        localStorage.setItem("special-counter", specialCounterInput.value);
    }

    // Save current season for Druid
    const seasonCounter = document.getElementById("season-counter");
    if (seasonCounter.style.display === "block") {
        localStorage.setItem("season-counter", seasonCounter.textContent);
    }
};

// Attach change event listeners to all inputs
document.getElementById("class-select").addEventListener("change", saveToLocalStorage);
document.getElementById("hp").addEventListener("input", saveToLocalStorage);
document.getElementById("defense").addEventListener("input", saveToLocalStorage);
document.getElementById("block").addEventListener("input", saveToLocalStorage);
document.getElementById("damage-received").addEventListener("input", saveToLocalStorage);
document.getElementById("special-counter").addEventListener("input", saveToLocalStorage);

// Calculate HP based on input values
document.getElementById("calculate-hp").addEventListener("click", () => {
    const hpInput = document.getElementById("hp");
    const defense = parseInt(document.getElementById("defense").value, 10) || 0;
    const block = parseInt(document.getElementById("block").value, 10) || 0;
    const damage = parseInt(document.getElementById("damage-received").value, 10) || 0;

    let currentHP = parseInt(hpInput.value, 10) || 0;
    const mitigatedDamage = Math.max(damage - defense, 0); // Apply defense first
    const remainingDamage = Math.max(mitigatedDamage - block, 0); // Apply block

    // Ensure HP respects the block rule
    if (currentHP < block) {
        // If current HP is already less than the block, leave it unchanged
        hpInput.value = currentHP;
    } else {
        // Otherwise, calculate HP and ensure it doesn't drop below the block value
        const newHP = Math.max(currentHP - remainingDamage, block);
        hpInput.value = newHP;
    }

    // Save updated HP to localStorage
    saveToLocalStorage();
});

// Update the season when rolling initiative
document.getElementById("roll-initiative").addEventListener("click", () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    document.getElementById("initiative-result").textContent = `You rolled: ${roll}`;

    const selectedClass = document.getElementById("class-select").value;

    // Update seasons for Druid
    if (selectedClass === "Druid") {
        const seasonCounter = document.getElementById("season-counter");
        const currentSeason = seasonCounter.textContent;
        const nextSeason = seasons[(seasons.indexOf(currentSeason) + 1) % seasons.length];
        seasonCounter.textContent = nextSeason;
        saveToLocalStorage(); // Save the updated season to localStorage
    }
});

// Lock/Unlock class toggle button
document.getElementById("lock-class-toggle").addEventListener("click", () => {
    const classSelect = document.getElementById("class-select");
    const lockButton = document.getElementById("lock-class-toggle");

    if (lockButton.textContent === "Lock") {
        // Lock the class selection
        classSelect.disabled = true;
        lockButton.textContent = "Locked";
    } else {
        // Unlock the class selection
        classSelect.disabled = false;
        lockButton.textContent = "Lock";
    }
});
