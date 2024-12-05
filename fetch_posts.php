<?php
include 'database.php';

$stmt = $pdo->query("SELECT id, type, title, content, votes FROM posts");
echo json_encode($stmt->fetchAll());
?>
