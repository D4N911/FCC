<?php
include 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postType = $_POST['post-type'];
    $title = $_POST['post-title'];
    $content = $_POST['post-content'];
    $imagePath = null;

    // Manejar la carga de imágenes
    if (isset($_FILES['postImage']) && $_FILES['postImage']['error'] === UPLOAD_ERR_OK) {
        $imageDir = './uploads/';
        if (!is_dir($imageDir)) {
            mkdir($imageDir, 0777, true); // Crear la carpeta si no existe
        }

        $imageName = time() . "_" . basename($_FILES['postImage']['name']);
        $imagePath = $imageDir . $imageName;

        if (!move_uploaded_file($_FILES['postImage']['tmp_name'], $imagePath)) {
            $imagePath = null; // Si falla, dejar el valor como null
        }
    }

    // Insertar publicación en la base de datos
    $stmt = $pdo->prepare("INSERT INTO posts (type, title, content, image_path) VALUES (?, ?, ?, ?)");
    $stmt->execute([$postType, $title, $content, $imagePath]);

    // Devolver respuesta
    $id = $pdo->lastInsertId();
    echo json_encode([
        "success" => true,
        "id" => $id,
        "image_path" => $imagePath
    ]);
}
?>
