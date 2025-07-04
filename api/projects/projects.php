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
    // Fetch all projects
    $stmt = $pdo->query('SELECT * FROM projects');
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch all tags
    $stmt = $pdo->query('SELECT project_id, tag FROM project_tags');
    $tags = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Map tags to projects
    $projectTags = [];
    foreach ($tags as $tag) {
        $projectTags[$tag['project_id']][] = $tag['tag'];
    }

    // Build result
    $result = array_map(function($project) use ($projectTags) {
        return [
            'id' => (int)$project['id'],
            'title' => $project['title'],
            'description' => $project['description'],
            'image' => $project['image'],
            'tags' => $projectTags[$project['id']] ?? [],
            'demoLink' => $project['demoLink'],
            'codeLink' => $project['codeLink'],
            'category' => $project['category']
        ];
    }, $projects);

    echo json_encode(['success' => true, 'data' => $result]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} 