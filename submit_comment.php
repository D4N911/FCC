<?php
include 'database.php';

$data = json_decode(file_get_contents('php://input'), true);
$post_id = isset($data['post_id']) ? (int)$data['post_id'] : 0;
$comment_text = isset($data['comment_text']) ? trim($data['comment_text']) : '';

if ($post_id > 0 && !empty($comment_text)) {
    $stmt = $pdo->prepare("INSERT INTO comments (post_id, comment_text) VALUES (:post_id, :comment_text)");
    $success = $stmt->execute(['post_id' => $post_id, 'comment_text' => $comment_text]);

    echo json_encode(['success' => $success]);
} else {
    echo json_encode(['success' => false]);
}
