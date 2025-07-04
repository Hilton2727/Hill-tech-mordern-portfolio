<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No file uploaded.']);
    exit;
}

$file = $_FILES['file'];
$filename = uniqid() . '_' . basename($file['name']);
$targetPath = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode([
        'success' => true,
        'file' => [
            'name' => $filename,
            'size' => filesize($targetPath),
            'url' => '/uploads/' . $filename
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to upload file.']);
} 