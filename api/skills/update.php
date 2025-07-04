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
            // Create a new skill
            $title = $input['title'] ?? '';
            $icon = $input['icon'] ?? '';
            $items = $input['skills'] ?? [];
            if (!$title) throw new Exception('Title required');
            $stmt = $pdo->prepare('INSERT INTO skills (title, icon) VALUES (?, ?)');
            $stmt->execute([$title, $icon]);
            $skill_id = $pdo->lastInsertId();
            foreach ($items as $i => $skill) {
                $stmt = $pdo->prepare('INSERT INTO skill_items (skill_id, skill, position) VALUES (?, ?, ?)');
                $stmt->execute([$skill_id, $skill, $i]);
            }
            echo json_encode(['success' => true, 'id' => $skill_id]);
            break;
        case 'update':
            // Update an existing skill
            $id = $input['id'] ?? null;
            $title = $input['title'] ?? '';
            $icon = $input['icon'] ?? '';
            $items = $input['skills'] ?? [];
            if (!$id) throw new Exception('Skill ID required');
            $stmt = $pdo->prepare('UPDATE skills SET title = ?, icon = ? WHERE id = ?');
            $stmt->execute([$title, $icon, $id]);
            // Remove all old items and re-insert
            $pdo->prepare('DELETE FROM skill_items WHERE skill_id = ?')->execute([$id]);
            foreach ($items as $i => $skill) {
                $stmt = $pdo->prepare('INSERT INTO skill_items (skill_id, skill, position) VALUES (?, ?, ?)');
                $stmt->execute([$id, $skill, $i]);
            }
            echo json_encode(['success' => true]);
            break;
        case 'delete':
            // Delete a skill and its items
            $id = $input['id'] ?? null;
            if (!$id) throw new Exception('Skill ID required');
            $pdo->prepare('DELETE FROM skill_items WHERE skill_id = ?')->execute([$id]);
            $pdo->prepare('DELETE FROM skills WHERE id = ?')->execute([$id]);
            echo json_encode(['success' => true]);
            break;
        case 'add_item':
            // Add a new skill item to a skill
            $skill_id = $input['skill_id'] ?? null;
            $skill = $input['skill'] ?? '';
            $position = $input['position'] ?? 0;
            if (!$skill_id || !$skill) throw new Exception('Skill ID and skill required');
            $stmt = $pdo->prepare('INSERT INTO skill_items (skill_id, skill, position) VALUES (?, ?, ?)');
            $stmt->execute([$skill_id, $skill, $position]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
        case 'update_item':
            // Update a skill item
            $item_id = $input['item_id'] ?? null;
            $skill = $input['skill'] ?? '';
            $position = $input['position'] ?? 0;
            if (!$item_id || !$skill) throw new Exception('Item ID and skill required');
            $stmt = $pdo->prepare('UPDATE skill_items SET skill = ?, position = ? WHERE id = ?');
            $stmt->execute([$skill, $position, $item_id]);
            echo json_encode(['success' => true]);
            break;
        case 'delete_item':
            // Delete a skill item
            $item_id = $input['item_id'] ?? null;
            if (!$item_id) throw new Exception('Item ID required');
            $stmt = $pdo->prepare('DELETE FROM skill_items WHERE id = ?');
            $stmt->execute([$item_id]);
            echo json_encode(['success' => true]);
            break;
        default:
            throw new Exception('Invalid action');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} 