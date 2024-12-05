<?php
include 'database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id']) && isset($data['vote'])) {
    $stmt = $pdo->prepare("UPDATE posts SET votes = votes + ? WHERE id = ?");
    $stmt->execute([$data['vote'], $data['id']]);

    $stmt = $pdo->prepare("SELECT votes FROM posts WHERE id = ?");
    $stmt->execute([$data['id']]);
    $newVoteCount = $stmt->fetchColumn();

    echo json_encode(["success" => true, "newVoteCount" => $newVoteCount]);
}
?>
