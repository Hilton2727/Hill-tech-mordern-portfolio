<?php
header('Access-Control-Allow-Origin: *');

$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/';
$resumeFile = null;

// Fetch admin name from hero table
require_once __DIR__ . '/../lib/config.php';
$adminName = 'resume';
try {
    $stmt = $pdo->query('SELECT name FROM hero LIMIT 1');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row && !empty($row['name'])) {
        $adminName = preg_replace('/[^a-zA-Z0-9_-]/', '', str_replace(' ', '_', $row['name']));
    }
} catch (Exception $e) {
    // fallback to 'resume'
}

if (is_dir($uploadDir)) {
    $files = scandir($uploadDir);
    foreach ($files as $file) {
        if (preg_match('/\.(pdf|docx)$/i', $file)) {
            $resumeFile = $file;
            break;
        }
    }
}

if ($resumeFile) {
    $targetPath = $uploadDir . $resumeFile;
    $mimeType = mime_content_type($targetPath);
    $ext = pathinfo($resumeFile, PATHINFO_EXTENSION);
    $downloadName = $adminName . '_cv.' . $ext;
    header('Content-Type: ' . $mimeType);
    header('Content-Disposition: attachment; filename="' . $downloadName . '"');
    header('Content-Length: ' . filesize($targetPath));
    readfile($targetPath);
    exit;
} else {
    http_response_code(404);
    echo 'No resume found.';
} 