<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once '../lib/config.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) throw new Exception('Invalid JSON input');

    $name = $input['name'] ?? '';
    $tagline = $input['tagline'] ?? '';
    $socialLinks = $input['socialLinks'] ?? [];

    $stmt = $pdo->prepare("UPDATE hero SET name = ?, tagline = ? WHERE id = 1");
    $stmt->execute([$name, $tagline]);

    $stmt = $pdo->prepare("DELETE FROM hero_social_links WHERE hero_id = 1");
    $stmt->execute();

    if (!empty($socialLinks)) {
        $stmt = $pdo->prepare("INSERT INTO hero_social_links (hero_id, name, url, icon) VALUES (1, ?, ?, ?)");
        foreach ($socialLinks as $link) {
            $stmt->execute([$link['name'], $link['url'], $link['icon']]);
        }
    }

    echo json_encode(['success' => true, 'message' => 'Hero updated']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update hero', 'message' => $e->getMessage()]);
} 