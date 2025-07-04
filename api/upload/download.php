<?php
header('Access-Control-Allow-Origin: *');

$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET' || !isset($_GET['filename'])) {
    http_response_code(400);
    echo 'No file specified.';
    exit;
}

$filename = $_GET['filename'];
if (!$filename || strpos($filename, '..') !== false) {
    http_response_code(400);
    echo 'Invalid filename.';
    exit;
}
$targetPath = $uploadDir . basename($filename);
if (file_exists($targetPath) && is_file($targetPath)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($filename) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($targetPath));
    readfile($targetPath);
    exit;
} else {
    http_response_code(404);
    echo 'File not found.';
} 