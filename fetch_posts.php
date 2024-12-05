<?php
include 'database.php';

// Obtener parámetros de búsqueda y filtrado
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$type = isset($_GET['type']) ? trim($_GET['type']) : '';

// Construir la consulta SQL dinámicamente
$sql = "SELECT id, type, title, content, image_path, votes, created_at FROM posts WHERE 1=1";

// Si se especifica un tipo válido (foro o anuncio), filtrar por él
if ($type === 'foro' || $type === 'anuncio') {
    $sql .= " AND type = :type";
}

// Si hay texto de búsqueda, filtrar por título o contenido
if (!empty($search)) {
    // Nota: Esto es un ejemplo simple, se recomienda usar búsquedas de texto completo
    $sql .= " AND (title LIKE :search OR content LIKE :search)";
}

$sql .= " ORDER BY votes DESC"; // ordenar por votos, por ejemplo

$stmt = $pdo->prepare($sql);

// Vincular parámetros si existen
if ($type === 'foro' || $type === 'anuncio') {
    $stmt->bindValue(':type', $type, PDO::PARAM_STR);
}

if (!empty($search)) {
    $stmt->bindValue(':search', '%' . $search . '%', PDO::PARAM_STR);
}

$stmt->execute();
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($posts);
