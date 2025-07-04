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

// Import shared database config
require_once __DIR__ . '/../lib/config.php';

try {
    // Get POST data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Debug log
    error_log('Received data: ' . $input);
    
    if (!isset($data['email']) || !isset($data['password'])) {
        throw new Exception('Email and password are required');
    }

    // Connect to database
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare and execute query
    $stmt = $pdo->prepare('SELECT * FROM admin WHERE email = ?');
    $stmt->execute([$data['email']]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    // Debug log
    error_log('Found admin: ' . ($admin ? 'yes' : 'no'));
    if ($admin) {
        error_log('Stored password hash: ' . $admin['password']);
        error_log('Password verification result: ' . (password_verify($data['password'], $admin['password']) ? 'true' : 'false'));
    }

    // Verify password
    if ($admin && password_verify($data['password'], $admin['password'])) {
        // Start session and store admin info
        session_start();
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_email'] = $admin['email'];
        
        // Return success response
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'admin' => [
                'id' => $admin['id'],
                'email' => $admin['email']
            ]
        ]);
    } else {
        // Return error response
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password'
        ]);
    }
} catch (Exception $e) {
    // Return error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 