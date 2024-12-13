"use strict";

// Function to calculate monthly usage
function addMonths() {
    var annualUseKw = 0;
    var months = document.getElementById('mpc').getElementsByTagName('input');
    for (var i = 0; i < months.length; i++) {
        var x = Number(months[i].value);
        console.log("Month " + (i + 1) + ": " + x);  // Log each month's value
        annualUseKw += x;
    }
    var dailyUseKw = annualUseKw / 365;
    console.log("Total daily consumption: " + dailyUseKw);  // Log daily consumption
    return dailyUseKw;
}

// Function to get the correct sun hours based on the zone
function sunHours() {
    var hrs;
    var theZone = document.forms.solarForm.zone.selectedIndex;
    console.log("Selected zone index: " + theZone); // Log the zone index
    theZone += 1;
    switch (theZone) {
        case 1: hrs = 6; break;
        case 2: hrs = 5.5; break;
        case 3: hrs = 5; break;
        case 4: hrs = 4.5; break;
        case 5: hrs = 4.2; break;
        case 6: hrs = 3.5; break;
        default: hrs = 6;
    }
    return hrs;
}

// Function to get the selected solar panel
function calculatePanel() {
    var userChoice = document.forms.solarForm.panel.selectedIndex;
    var panelOptions = document.forms.solarForm.panel.options;
    var power = panelOptions[userChoice].value;
    var name = panelOptions[userChoice].text;
    console.log("Selected panel power: " + power + ", name: " + name);  // Log selected panel info
    return [power, name];
}

// Function to calculate savings
function calculateSavings() {
    var electricityCostPerKWh = 0.12; // Example cost per kWh in dollars
    var annualKwUsage = addMonths() * 365; // Total annual usage in kWh
    var annualSavings = annualKwUsage * electricityCostPerKWh; // Estimated savings per year
    return annualSavings;
}

// Function to calculate CO2 reduction
function calculateCarbonFootprintReduction() {
    var annualKwUsage = addMonths() * 365;
    var co2PerKw = 0.92; // CO2 in pounds per kWh
    var co2Savings = annualKwUsage * co2PerKw; // Total CO2 saved per year
    return co2Savings;
}

// Function to display the chart
function displayChart(dailyUseKw, panelsNeeded, panelOutput) {
    var ctx = document.getElementById('solarChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Daily Consumption (KWh)', 'Solar Output (KWh)'],
            datasets: [{
                label: 'Energy Comparison',
                data: [dailyUseKw, panelsNeeded * panelOutput / 1000], // Panels output in kWh
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to calculate the solar panel details and display the results
function calculateSolar() {
    var dailyUseKw = addMonths();
    var sunHoursPerDay = sunHours();
    var minKwNeeds = dailyUseKw / sunHoursPerDay;
    var realKWNeeds = minKwNeeds * 1.25;
    var realWattNeeds = realKWNeeds * 1000;

    var panelInfo = calculatePanel();
    var panelOutput = panelInfo[0];
    var panelName = panelInfo[1];

    var panelsNeeded = Math.ceil(realWattNeeds / panelOutput);

    // Display the chart
    displayChart(dailyUseKw, panelsNeeded, panelOutput);

    // Calculate savings and CO2 reduction
    var annualSavings = calculateSavings();
    var co2Reduction = calculateCarbonFootprintReduction();

    var feedback = "";
    feedback += "<p>Based on your average daily use of " + Math.round(dailyUseKw) + " KWh, you will need to purchase " + panelsNeeded + " " + panelName + " brand solar panels to offset 100% of your electricity bill.</p>";
    feedback += "<h2>Additional Details</h2>";
    feedback += "<p>Your average daily electricity consumption: " + Math.round(dailyUseKw) + " KWh per day.</p>";
    feedback += "<p>Average sunshine hours per day: " + sunHoursPerDay + " hours.</p>";
    feedback += "<p>Realistic watts needed per hour: " + Math.round(realWattNeeds) + " watts/hour.</p>";
    feedback += "<p>The " + panelName + " panel you selected generates about " + panelOutput + " watts per hour.</p>";
    feedback += "<p><strong>Estimated Annual Savings: $" + annualSavings.toFixed(2) + "</strong></p>";
    feedback += "<p><strong>CO2 Reduction: " + co2Reduction.toFixed(2) + " pounds per year</strong></p>";

    document.getElementById('feedback').innerHTML = feedback;
}
