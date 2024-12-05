<?php
include 'database.php';

$post_id = isset($_GET['post_id']) ? (int)$_GET['post_id'] : 0;

$stmt = $pdo->prepare("SELECT id, comment_text, created_at FROM comments WHERE post_id = :post_id ORDER BY created_at DESC");
$stmt->execute(['post_id' => $post_id]);
$comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($comments);
