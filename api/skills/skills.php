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
    // Fetch all skills
    $stmt = $pdo->query('SELECT * FROM skills');
    $skills = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch all skill items
    $stmt = $pdo->query('SELECT skill_id, skill FROM skill_items ORDER BY position ASC');
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Map items to skills
    $skillItems = [];
    foreach ($items as $item) {
        $skillItems[$item['skill_id']][] = $item['skill'];
    }

    // Build result
    $result = array_map(function($skill) use ($skillItems) {
        return [
            'title' => $skill['title'],
            'icon' => $skill['icon'],
            'skills' => $skillItems[$skill['id']] ?? []
        ];
    }, $skills);

    echo json_encode(['success' => true, 'data' => $result]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} 