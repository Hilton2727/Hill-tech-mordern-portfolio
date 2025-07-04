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
    $status = $_POST['status'] ?? 'online';
    $title = $_POST['title'] ?? 'Software Engineer';
    $profileImagePath = null;
    if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        $filename = uniqid() . '_' . basename($_FILES['profile_image']['name']);
        move_uploaded_file($_FILES['profile_image']['tmp_name'], $uploadDir . $filename);
        $profileImagePath = '/uploads/' . $filename;
    } else if (isset($_POST['profile_image'])) {
        $profileImagePath = $_POST['profile_image']; // fallback for existing image
    }

    // Update about table
    $stmt = $pdo->prepare("UPDATE about SET profile_image = ?, status = ?, title = ? WHERE id = 1");
    $stmt->execute([$profileImagePath, $status, $title]);

    $paragraphs = isset($_POST['paragraphs']) ? json_decode($_POST['paragraphs'], true) : [];
    $stats = isset($_POST['stats']) ? json_decode($_POST['stats'], true) : [];

    // Remove old paragraphs and stats
    $stmt = $pdo->prepare("DELETE FROM about_paragraphs WHERE about_id = 1");
    $stmt->execute();
    $stmt = $pdo->prepare("DELETE FROM about_stats WHERE about_id = 1");
    $stmt->execute();

    // Insert new paragraphs
    if (!empty($paragraphs)) {
        $stmt = $pdo->prepare("INSERT INTO about_paragraphs (about_id, paragraph, position) VALUES (1, ?, ?)");
        foreach ($paragraphs as $i => $paragraph) {
            $stmt->execute([$paragraph, $i]);
        }
    }

    // Insert new stats
    if (!empty($stats)) {
        $stmt = $pdo->prepare("INSERT INTO about_stats (about_id, value, label, position) VALUES (1, ?, ?, ?)");
        foreach ($stats as $i => $stat) {
            $stmt->execute([$stat['value'], $stat['label'], $i]);
        }
    }

    echo json_encode(['success' => true, 'message' => 'About updated']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update about', 'message' => $e->getMessage()]);
} 