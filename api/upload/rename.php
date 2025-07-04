<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$oldName = $data['oldName'] ?? '';
$newName = $data['newName'] ?? '';
if (!$oldName || !$newName || strpos($oldName, '..') !== false || strpos($newName, '..') !== false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid filename.']);
    exit;
}
$oldPath = $uploadDir . basename($oldName);
$newPath = $uploadDir . basename($newName);
if (file_exists($oldPath) && is_file($oldPath)) {
    if (rename($oldPath, $newPath)) {
        echo json_encode(['success' => true, 'newName' => basename($newName)]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to rename file.']);
    }
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'File not found.']);
} 