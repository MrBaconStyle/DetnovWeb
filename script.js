// Function to extract a bit from a binary value
function extractBitFromBinary(binaryValue, bitPosition) {
    return binaryValue.charAt(binaryValue.length - 1 - bitPosition);
}

// Function to convert hexadecimal to binary
function parseHexToBinary(decValue) {
    return parseInt(decValue, 10).toString(2).padStart(8, '0');
}

// Function to update the color of the sounder-on-circle element
function updateSounderOnCircleColor(address20Value) {
    var binaryValue = parseHexToBinary(address20Value);
    var sounderOnValue = extractBitFromBinary(binaryValue, 1);
    if (sounderOnValue === "1") {
        $("#sounder-on-circle").removeClass("gray").addClass("yellow");
    } else {
        $("#sounder-on-circle").removeClass("yellow").addClass("gray");
    }
}

// Function to update the color of the power-circle element
function updatePowerCircleColor(address00Value) {
    var binaryValue = parseHexToBinary(address00Value);
    var powerOnValue = extractBitFromBinary(binaryValue, 7);
    console.log(address00Value);
    if (address00Value === 1) {
        $("#power-circle").removeClass("gray").addClass("green");
        //console.log("Proslo");
    } else {
        $("#power-circle").removeClass("green").addClass("gray");
        //console.log("Nije proslo");
    }
}

// Function to update the color of the sounder-off-circle element
function updateSounderOffCircleColor(address20Value) {
    var binaryValue = parseHexToBinary(address20Value);
    var sounderOffValue = extractBitFromBinary(binaryValue, 2);
    if (sounderOffValue === "1") {
        $("#sounders-off-circle").removeClass("gray").addClass("yellow");
    } else {
        $("#sounders-off-circle").removeClass("yellow").addClass("gray");
    }
}

// Function to update the color of the buzzer-off-circle element
function updateBuzzerOffCircleColor(address20Value) {
    var binaryValue = parseHexToBinary(address20Value);
    var buzzerOffValue = extractBitFromBinary(binaryValue, 0);
    if (buzzerOffValue === "1") {
        $("#buzzer-off-circle").removeClass("gray").addClass("yellow");
    } else {
        $("#buzzer-off-circle").removeClass("yellow").addClass("gray");
    }
}

// Function to update the color of the buzzer-off-circle element
function updateAlarmCircleColor(address22Value) {
    var binaryValue = parseHexToBinary(address22Value);
    //console.log(binaryValue);
    var alarmValue = extractBitFromBinary(binaryValue, 0);
    //console.log(alarmValue);

    $('#fire-alarm-circle').toggleClass('red', alarmValue === '1');

    // if (alarmValue === "1") {
    //     $("#buzzer-off-circle").removeClass("gray").addClass("yellow");
    // } else {
    //     $("#buzzer-off-circle").removeClass("yellow").addClass("gray");
    // }
}

function updateSounderDelayColor(address20Value) {
    var binaryValue = parseHexToBinary(address20Value);
    var sounderDelayValue = extractBitFromBinary(binaryValue, 7);
    if (sounderDelayValue === "1") {
        $("#sounder-delay-circle").removeClass("gray").addClass("yellow");
    } else {
        $("#sounder-delay-circle").removeClass("yellow").addClass("gray");
    }
}

function updateSounderDisabledColor(address20Value) {
    var binaryValue = parseHexToBinary(address20Value);
    var sounderDisabledValue = extractBitFromBinary(binaryValue, 6);
    if (sounderDisabledValue === "1") {
        $("#sounder-fault-circle").removeClass("gray").addClass("yellow");
    } else {
        $("#sounder-fault-circle").removeClass("yellow").addClass("gray");
    }
}

function updateRelayDisabledColor(address20Value) {
    var binaryValue = parseHexToBinary(address20Value);
    var relayDisabledValue = extractBitFromBinary(binaryValue, 5);
    if (relayDisabledValue === "1") {
        $("#relay-disabled-circle").removeClass("gray").addClass("yellow");
    } else {
        $("#relay-disabled-circle").removeClass("yellow").addClass("gray");
    }
}

function updateDisabledColor(address20Value) {
    var binaryValue = parseHexToBinary(address20Value);
    var zoneDisabled = extractBitFromBinary(binaryValue, 4);
    var sounderDisabledValue = extractBitFromBinary(binaryValue, 6);
    var relayDisabledValue = extractBitFromBinary(binaryValue, 5);
    if (zoneDisabled === "1" || sounderDisabledValue === "1" || relayDisabledValue === "1") {
        $("#disabled-circle").removeClass("gray").addClass("yellow");
    } else {
        $("#disabled-circle").removeClass("yellow").addClass("gray");
    }
}

// Function to update the ALARM text and counter
function updateAlarmDisplay(alarms) {
    if (alarms.length > 0) {
        // Update the total number of alarms
        totalAlarms = alarms.length;

        // Get the value of "point" based on the current index
        var currentPoint = alarms[currentPointIndex].point;

        // Update the content of the screen div with the ALARM text and counter
        $("#screen11").text("ALARM " + (currentPointIndex + 1).toString().padStart(3, '0') + "/" + totalAlarms.toString().padStart(3, '0') + ": " + currentPoint)
            .removeClass("gray").addClass("white");

        // Increment the current point index for the next iteration
        currentPointIndex = (currentPointIndex + 1) % totalAlarms;
    } else {
        // If no alarms, display "NORMAL"
        $("#screen11").text("SYSTEM NORMAL").removeClass("white").addClass("gray");
        // Reset the current point index and total alarms
        currentPointIndex = 0;
        totalAlarms = 0;
    }
}

// Global variable to keep track of the current point index
var currentPointIndex = 0;
var totalAlarms = 0;

// Function to fetch JSON data and update the page
function fetchDataAndUpdatePage() {
    // Make an AJAX request to fetch the JSON data
    $.ajax({
        url: 'data.json',
        method: 'GET',
        dataType: 'json',
        success: function (response) {

            // Access the alarms array
            var alarms = response.alarms;

            // Call the function to update the ALARM display
            updateAlarmDisplay(alarms);

            // Access the value from address 20
            var address20Value = response.registers.find(function (register) {
                return register.address === '0x20';
            }).value;

            // Access the value from address 20
            var address22Value = response.registers.find(function (register) {
                return register.address === '0x22';
            }).value;

            // Access the value from address 20
            var address00Value = response.registers.find(function (register) {
                return register.address === '0x0';
            }).value;

            // Call the update functions with the retrieved value
            updateSounderOnCircleColor(address20Value);
            updateSounderOffCircleColor(address20Value);
            updateBuzzerOffCircleColor(address20Value);
            updateAlarmCircleColor(address22Value);
            updateSounderDelayColor(address20Value);
            updateSounderDisabledColor(address20Value);
            updateRelayDisabledColor(address20Value);
            updateDisabledColor(address20Value);
            updatePowerCircleColor(address00Value);

        },
        error: function (xhr, status, error) {
            console.error('AJAX Error: ' + error);
        },
        complete: function () {
            // Schedule the next data refresh after 2 seconds
            setTimeout(fetchDataAndUpdatePage, 2000);
        }
    });
}

// Start fetching data and updating the page
fetchDataAndUpdatePage();
