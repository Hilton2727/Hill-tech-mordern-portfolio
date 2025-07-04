<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

// Check if admin is logged in
if (isset($_SESSION['admin_id']) && isset($_SESSION['admin_email'])) {
    echo json_encode([
        'success' => true,
        'authenticated' => true,
        'admin' => [
            'id' => $_SESSION['admin_id'],
            'email' => $_SESSION['admin_email']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => true,
        'authenticated' => false
    ]);
} 