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
$site_name = $input['site_name'] ?? '';
$site_logo = $input['site_logo'] ?? '';
$favicon = $input['favicon'] ?? '';
$site_title = $input['site_title'] ?? '';
$site_description = $input['site_description'] ?? '';
$site_url = $input['site_url'] ?? '';
try {
    $stmt = $pdo->query('SELECT id FROM site_settings LIMIT 1');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        $id = $row['id'];
        $stmt = $pdo->prepare('UPDATE site_settings SET site_name=?, site_logo=?, favicon=?, site_title=?, site_description=?, site_url=?, updated_at=NOW() WHERE id=?');
        $stmt->execute([$site_name, $site_logo, $favicon, $site_title, $site_description, $site_url, $id]);
    } else {
        $stmt = $pdo->prepare('INSERT INTO site_settings (site_name, site_logo, favicon, site_title, site_description, site_url) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([$site_name, $site_logo, $favicon, $site_title, $site_description, $site_url]);
    }
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} 