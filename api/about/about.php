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
    // Fetch the about (assuming only one row)
    $stmt = $pdo->query('SELECT * FROM about LIMIT 1');
    $about = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$about) {
        echo json_encode(['success' => false, 'message' => 'No about found']);
        exit();
    }

    // Fetch paragraphs
    $stmt = $pdo->prepare('SELECT paragraph FROM about_paragraphs WHERE about_id = ? ORDER BY position ASC');
    $stmt->execute([$about['id']]);
    $paragraphs = array_map(function($row) { return $row['paragraph']; }, $stmt->fetchAll(PDO::FETCH_ASSOC));

    // Fetch stats
    $stmt = $pdo->prepare('SELECT value, label FROM about_stats WHERE about_id = ? ORDER BY position ASC');
    $stmt->execute([$about['id']]);
    $stats = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $rotatingTextsRaw = $about['rotating_texts'] ?? '[]';
    $rotatingTexts = json_decode($rotatingTextsRaw, true);
    if (!is_array($rotatingTexts)) $rotatingTexts = [];
    $result = [
        'profile_image' => $about['profile_image'] ?? null,
        'status' => $about['status'] ?? 'online',
        'title' => $about['title'] ?? 'Software Engineer',
        'rotating_texts' => $rotatingTexts,
        'creative_text' => $about['creative_text'] ?? 'Creative',
        'paragraphs' => $paragraphs,
        'stats' => $stats
    ];

    echo json_encode(['success' => true, 'data' => $result]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} 