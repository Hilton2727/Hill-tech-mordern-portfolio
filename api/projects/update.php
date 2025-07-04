<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../lib/config.php';

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

try {
    switch ($action) {
        case 'create':
            $title = $input['title'] ?? '';
            $description = $input['description'] ?? '';
            $image = $input['image'] ?? '';
            $tags = $input['tags'] ?? [];
            $demoLink = $input['demoLink'] ?? '';
            $codeLink = $input['codeLink'] ?? '';
            $category = $input['category'] ?? '';
            if (!$title) throw new Exception('Title required');
            $stmt = $pdo->prepare('INSERT INTO projects (title, description, image, demoLink, codeLink, category) VALUES (?, ?, ?, ?, ?, ?)');
            $stmt->execute([$title, $description, $image, $demoLink, $codeLink, $category]);
            $project_id = $pdo->lastInsertId();
            foreach ($tags as $tag) {
                $stmt = $pdo->prepare('INSERT INTO project_tags (project_id, tag) VALUES (?, ?)');
                $stmt->execute([$project_id, $tag]);
            }
            echo json_encode(['success' => true, 'id' => $project_id]);
            break;
        case 'update':
            $id = $input['id'] ?? null;
            $title = $input['title'] ?? '';
            $description = $input['description'] ?? '';
            $image = $input['image'] ?? '';
            $tags = $input['tags'] ?? [];
            $demoLink = $input['demoLink'] ?? '';
            $codeLink = $input['codeLink'] ?? '';
            $category = $input['category'] ?? '';
            if (!$id) throw new Exception('Project ID required');
            $stmt = $pdo->prepare('UPDATE projects SET title = ?, description = ?, image = ?, demoLink = ?, codeLink = ?, category = ? WHERE id = ?');
            $stmt->execute([$title, $description, $image, $demoLink, $codeLink, $category, $id]);
            $pdo->prepare('DELETE FROM project_tags WHERE project_id = ?')->execute([$id]);
            foreach ($tags as $tag) {
                $stmt = $pdo->prepare('INSERT INTO project_tags (project_id, tag) VALUES (?, ?)');
                $stmt->execute([$id, $tag]);
            }
            echo json_encode(['success' => true]);
            break;
        case 'delete':
            $id = $input['id'] ?? null;
            if (!$id) throw new Exception('Project ID required');
            $pdo->prepare('DELETE FROM project_tags WHERE project_id = ?')->execute([$id]);
            $pdo->prepare('DELETE FROM projects WHERE id = ?')->execute([$id]);
            echo json_encode(['success' => true]);
            break;
        default:
            throw new Exception('Invalid action');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} 