<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once __DIR__ . '/../lib/config.php';
$input = json_decode(file_get_contents('php://input'), true);
$host = $input['host'] ?? '';
$port = $input['port'] ?? 587;
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';
$encryption = $input['encryption'] ?? 'tls';
$from_email = $input['from_email'] ?? '';
$from_name = $input['from_name'] ?? '';
try {
    $stmt = $pdo->query('SELECT id FROM smtp_settings LIMIT 1');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        $id = $row['id'];
        $stmt = $pdo->prepare('UPDATE smtp_settings SET host=?, port=?, username=?, password=?, encryption=?, from_email=?, from_name=?, updated_at=NOW() WHERE id=?');
        $stmt->execute([$host, $port, $username, $password, $encryption, $from_email, $from_name, $id]);
    } else {
        $stmt = $pdo->prepare('INSERT INTO smtp_settings (host, port, username, password, encryption, from_email, from_name) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$host, $port, $username, $password, $encryption, $from_email, $from_name]);
    }
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} 