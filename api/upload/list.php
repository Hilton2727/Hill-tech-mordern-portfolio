<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$files = array_values(array_filter(scandir($uploadDir), function($file) use ($uploadDir) {
    return !in_array($file, ['.', '..']) && is_file($uploadDir . $file);
}));

$fileList = array_map(function($file) use ($uploadDir) {
    return [
        'name' => $file,
        'size' => filesize($uploadDir . $file),
        'modified' => date('Y-m-d H:i:s', filemtime($uploadDir . $file)),
        'url' => '/uploads/' . $file
    ];
}, $files);

echo json_encode(['success' => true, 'files' => $fileList]); 