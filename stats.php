<?php
include 'database.php';

$foroCount = $pdo->query("SELECT COUNT(*) FROM posts WHERE type = 'foro'")->fetchColumn();
$anuncioCount = $pdo->query("SELECT COUNT(*) FROM posts WHERE type = 'anuncio'")->fetchColumn();

echo json_encode(["foro" => $foroCount, "anuncio" => $anuncioCount]);
?>
