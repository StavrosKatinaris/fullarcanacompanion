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
        specialCounterGroup.style.display = "flex";

        if (selectedClass === "Druid") {
            // Display seasons for Druid
            specialCounterLabel.textContent = "Seasons";
            specialCounterInput.style.display = "none";
            seasonCounter.style.display = "block";
            seasonCounter.textContent = "Spring"; // Default to Spring
        } else {
            // Display numeric counter for Healer and Barbarian
            specialCounterLabel.textContent = specialClasses[selectedClass];
            specialCounterInput.style.display = "block";
            seasonCounter.style.display = "none";
            specialCounterInput.value = 0; // Reset the value
        }
    } else {
        // Hide special counter for other classes
        specialCounterGroup.style.display = "none";
    }
});

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
});

// Roll Initiative and update seasons
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
    }
});
