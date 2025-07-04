<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../lib/config.php';

try {
    // Fetch the hero (assuming only one row)
    $stmt = $pdo->query('SELECT * FROM hero LIMIT 1');
    $hero = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$hero) {
        echo json_encode(['success' => false, 'message' => 'No hero found']);
        exit();
    }

    // Fetch social links for this hero
    $stmt = $pdo->prepare('SELECT name, url, icon FROM hero_social_links WHERE hero_id = ?');
    $stmt->execute([$hero['id']]);
    $socialLinks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = [
        'name' => $hero['name'],
        'tagline' => $hero['tagline'],
        'socialLinks' => $socialLinks
    ];

    echo json_encode(['success' => true, 'data' => $result]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} 