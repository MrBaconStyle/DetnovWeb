<?php
$jsonString = file_get_contents('php://input');

if (!empty($jsonString)) {
    echo "Received JSON data: " . $jsonString;
    // Save the JSON string to a file
    file_put_contents('data.json', $jsonString);
} else {
    echo "No JSON data received";
}
?>
